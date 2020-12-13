import {BaseState, MainMenuState} from "./internal";
import TelegramBot, {CallbackQuery, Message, PreCheckoutQuery, SendMessageOptions} from "node-telegram-bot-api";
import App from "../App";

class StateContext {
    private state: BaseState;
    private readonly chatId: number;
    private lastMessageId: number | null;
    private readonly app: App;
    private readonly bot: TelegramBot;

    constructor(bot: TelegramBot, app: App, chatId: number) {
        this.bot = bot;
        this.state = new MainMenuState(this);
        this.app = app;
        this.chatId = chatId;
        this.lastMessageId = null;
    }

    public setState = async (state: BaseState) => {
        this.state = state;
        await this.initState();
    }

    public getApp = () => this.app;

    public getChatId = () => this.chatId;

    public getLastMessageId = () => this.lastMessageId;

    public getBot = () => this.bot;

    public sendMessage = async (message: string, options?: SendMessageOptions) => {
        const {message_id} = await this.state.sendMessage(message, options);
        this.lastMessageId = message_id;
    }

    public messageController = async (message: Message) => {
        const app = this.getApp();
        try {
            await this.state.onNewMessage();
        } catch(e) {}
        if(message.text?.trim() === 'Вернуться в меню') {
            await this.setState(new MainMenuState(this));
            return this.sendMessage('Выберите интересующую вас тему:');
        }
        if(message.text?.trim() === '/start') {
            await this.setState(new MainMenuState(this));
            app.setFeedbackGiven(this.getChatId(), false);
            app.resetFeedback(this.getChatId());
            app.resetOrderInfo(this.getChatId());
            await this.sendMessage('Добрый день! Вас приветствует компания StudWork!');
            return this.sendMessage('Выберите интересующую вас тему:');
        }
        return this.state.messageController(message);
    }

    public callbackController = async (callback: CallbackQuery) => {
        return this.state.callbackController(callback);
    }

    public initState = async () => {
        return this.state.initState();
    }
}

export default StateContext;