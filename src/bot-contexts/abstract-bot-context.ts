import AbstractStateContext from "../state";
import TelegramBot from "node-telegram-bot-api";
import Status from "../database/models/Status";
import FeedbackType from "../database/models/FeedbackType";
import App from "../App";
import Order from "../database/models/Order";

export default abstract class AbstractBotContext {
    protected chatStateContext: { [key: number]: AbstractStateContext | undefined } = {};
    private readonly bot: TelegramBot | null = null;
    protected statuses: Array<Status> = [];
    protected feedbackTypes: Array<FeedbackType> = [];

    constructor(bot: TelegramBot) {
        this.bot = bot;
    }

    getStatuses = () => this.statuses;

    getFeedbackTypes = () => this.feedbackTypes;

    async notifyAboutOrders (chatIds: Array<number>, order: Order) {
        await Promise.all(chatIds.map(async (chatId) => {
            const stateContext = this.getChatStateContext(chatId);
            await stateContext.notifyAboutOrder(order)
        }))
    }

    public getBot = () => this.bot as TelegramBot;

    abstract init(): Promise<any>;

    public abstract getChatStateContext(chatId: number): AbstractStateContext;
}