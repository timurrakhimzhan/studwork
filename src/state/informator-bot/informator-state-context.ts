import {AbstractStateContext, WelcomeState, LoginInputState, MainMenuState, OrdersState} from "./internal";
import InformatorBotContext from "../../bot-contexts/informator-bot";
import Teacher from "../../database/models/Teacher";
import AuthenticationError from "../../errors/authentication-error";
import {Message} from "node-telegram-bot-api";
import Order from "../../database/models/Order";
import {generateClientNotification, generateTeacherNotification} from "../../utils/message-utils";
import moment from 'moment';
import {ERROR_TOO_MANY_ATTEMPTS, ERROR_WRONG_CREDENTIALS} from "../../constants";

export default class InformatorStateContext extends AbstractStateContext {
    protected readonly botContext: InformatorBotContext;
    private teacher: Teacher;
    private isLoggedIn: boolean;
    private lastLoginDate: Date | null;
    private loginAttempts: number;
    constructor(botContext: InformatorBotContext, chatId: number) {
        super(botContext, chatId);
        this.botContext = botContext;
        this.state = new WelcomeState(this);
        this.teacher = new Teacher();
        this.isLoggedIn = false;
        this.lastLoginDate = null;
        this.loginAttempts = 0;
    }

    getTeacher = () => this.teacher;

    setTeacher = (teacher: Teacher) => {
        this.teacher = teacher;
    };

    resetTeacher = () => {
        this.teacher = new Teacher();
    };

    getIsLoggedIn = () => this.isLoggedIn;

    async getIsSessionActive(): Promise<boolean> {
        try {
            await this.teacher.reload();
        } catch(e) {
            return false;
        }
        const chatId: number | null = this.teacher.chatId;
        if(chatId === this.getChatId()) {
            return true;
        }
        this.isLoggedIn = false;
        return false;
    }

    async login(username?: string) {
        const diffHours: number= moment.duration(moment(new Date).diff(this.lastLoginDate)).hours();
        if(this.loginAttempts >= 5 && diffHours < 1) {
            this.loginAttempts++;
            this.lastLoginDate = new Date();
            throw new AuthenticationError(ERROR_TOO_MANY_ATTEMPTS);
        }
        const teacher = await Teacher.findOne({ where: {
            login: this.teacher.login,
            mock: !!process.env['MOCK']
        }});
        if(teacher?.password !== this.teacher.password) {
            this.loginAttempts++;
            this.lastLoginDate = new Date();
            throw new AuthenticationError(ERROR_WRONG_CREDENTIALS);
        }
        teacher.chatId = this.getChatId();
        teacher.userName = username || null;
        await teacher.save();
        this.teacher = teacher;
        this.isLoggedIn = true;
        this.loginAttempts = 0;
        this.state = new OrdersState(this);
    }

    async logout() {
        this.teacher.chatId = null;
        this.teacher.save();
        this.isLoggedIn = false;
        return this.setState(new LoginInputState(this));
    }

    getBotContext(): InformatorBotContext {
        return this.botContext;
    }

    async notifyAboutOrder(order: Order) {
        if(this.getIsLoggedIn()) {
            const message: string = generateTeacherNotification(order, this.teacher.isAdmin);
            await this.setState(new OrdersState(this, message));
        }
    }

    async notifyReceiverBot(order: Order) {
        const chatId = order.chatId as number;
        await this.getBotContext().notifyReceiverBot([chatId], order);
    }

    async messageController(message: Message): Promise<any> {
        if(message.text?.trim() === '/start') {
            this.resetTeacher();
            return this.setState(new WelcomeState(this));
        }
        if(!this.getIsLoggedIn())  {
            return super.messageController(message);
        }
        const isSessionActive = await this.getIsSessionActive();
        if(!isSessionActive) {
            await this.sendMessage('Ваша сессия истекла!');
            return this.logout();
        }
        if(message.text?.trim() === 'Вернуться в меню') {
            return this.setState(new MainMenuState(this));

  }
        return super.messageController(message);
    }

}