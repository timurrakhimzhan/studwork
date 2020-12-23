import {AbstractStateContext, WelcomeState, LoginInputState, MainMenuState} from "./internal";
import InformatorBotContext from "../../bot-contexts/informator-bot";
import Teacher from "../../database/models/Teacher";
import AuthenticationError from "../../errors/authentication-error";
import {Message} from "node-telegram-bot-api";

export default class InformatorStateContext extends AbstractStateContext {
    protected readonly botContext: InformatorBotContext;
    private teacher: Teacher;
    private isLoggedIn: boolean;
    constructor(botContext: InformatorBotContext, chatId: number) {
        super(botContext, chatId);
        this.botContext = botContext;
        this.state = new WelcomeState(this);
        this.teacher = new Teacher();
        this.isLoggedIn = false;
    }

    getTeacher = () => this.teacher;

    resetTeacher = () => {
        this.teacher = new Teacher();
    }

    getIsLoggedIn = () => this.isLoggedIn;

    async getIsSessionActive(): Promise<boolean> {
        await this.teacher.reload();
        const chatId: number | null = this.teacher.chatId;
        if(chatId === this.getChatId()) {
            return true;
        }
        this.isLoggedIn = false;
        return false;
    }

    async login() {
        const teacher = await Teacher.findOne({ where: {
            login: this.teacher.login,
            mock: !!process.env['MOCK']
        }});
        if(teacher?.password !== this.teacher.password) {
            throw new AuthenticationError('Wrong password')
        }
        teacher.chatId = this.getChatId();
        await teacher.save();
        this.teacher = teacher;
        this.isLoggedIn = true;
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

    async messageController(message: Message): Promise<any> {
        if(message.text?.trim() === '/start') {
            this.resetTeacher();
            await this.setState(new WelcomeState(this));
        }
        if(!this.getIsLoggedIn())  {
            return super.messageController(message);
        }
        if(message.text?.trim() === 'Вернуться в меню') {
            return this.setState(new MainMenuState(this));
        }
        return super.messageController(message);
    }

}