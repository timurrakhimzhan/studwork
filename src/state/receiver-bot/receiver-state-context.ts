import {MainMenuState, AbstractStateContext, WelcomeState, OrdersState} from "./internal";
import {Message} from "node-telegram-bot-api";
import ReceiverBotContext from "../../bot-contexts/receiver-bot";
import Teacher from "../../database/models/Teacher";
import {Op} from "sequelize";
import {generateClientNotification, generateTeacherNotification} from "../../utils/message-utils";
import Order from "../../database/models/Order";

export default class ReceiverStateContext extends AbstractStateContext {
    protected readonly botContext: ReceiverBotContext;

    getBotContext() {
        return this.botContext;
    } ;

    constructor(botContext: ReceiverBotContext, chatId: number) {
        super(botContext, chatId);
        this.botContext = botContext;
        this.state = new WelcomeState(this);
    }

    async notifyAboutOrder(order:Order) {
        await this.setState(new OrdersState(this, generateClientNotification(order)));
    }

    async notifyInformatorBot(order: Order) {
        const admins = await Teacher.findAll({
            where: { isAdmin: true, chatId: { [Op.ne]: null } }
        });
        const teacher = await order.$get('teacher');
        order.teacher = teacher;
        let notifyChatIds = admins.map((admin) => admin.chatId as number);
        if(teacher && teacher.chatId) {
            notifyChatIds.push(teacher.chatId);
        }
        await this.getBotContext().notifyInformatorBot(notifyChatIds, order);
    }

    public async messageController(message: Message) {
        const botContext = this.getBotContext();
        if(message.text?.trim() === 'Вернуться в меню') {
            return this.setState(new MainMenuState(this));
        }
        if(message.text?.trim() === '/start') {
            botContext.setFeedbackGiven(this.getChatId(), false);
            await this.setState(new WelcomeState(this))
        }
        return super.messageController(message);
    }
}