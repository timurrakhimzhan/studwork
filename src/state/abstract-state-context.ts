import {CallbackQuery, Message, SendMessageOptions} from "node-telegram-bot-api";
import AbstractBotContext from "../bot-contexts";
import {AbstractBaseState} from "./internal";

abstract class AbstractStateContext {
    protected state: AbstractBaseState;
    private readonly chatId: number;
    private lastMessageId: number | null;
    protected readonly botContext: AbstractBotContext;

    protected constructor(botContext: AbstractBotContext, chatId: number) {
        this.botContext = botContext;
        this.state = new class extends AbstractBaseState {}(this);
        this.chatId = chatId;
        this.lastMessageId = null;
    }

    public setState = async (state: AbstractBaseState) => {
        this.state = state;
        await this.initState();
    }

    public abstract getBotContext(): AbstractBotContext;

    public getChatId = () => this.chatId;

    public getLastMessageId = () => this.lastMessageId;

    public sendMessage = async (message: string, options?: SendMessageOptions) => {
        const {message_id} = await this.state.sendMessage(message, options);
        this.lastMessageId = message_id;
    }

    async messageController(message: Message) {
        return this.state.messageController(message);
    }

    async callbackController (callback: CallbackQuery) {
        return this.state.callbackController(callback);
    }

    async initState() {
        return this.state.initState();
    }
}

export default AbstractStateContext;