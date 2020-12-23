import AbstractStateContext from "../state";
import TelegramBot from "node-telegram-bot-api";

export default abstract class AbstractBotContext {
    protected chatStateContext: { [key: number]: AbstractStateContext | undefined } = {};
    private readonly bot: TelegramBot | null = null;

    constructor(bot: TelegramBot) {
        this.bot = bot;
    }

    public getBot = () => this.bot as TelegramBot;

    abstract init(): Promise<any>;

    public abstract getChatStateContext(chatId: number): AbstractStateContext;
}