import {
    CallbackQuery,
    KeyboardButton,
    Message,
    SendMessageOptions
} from "node-telegram-bot-api";
import {StateContext, MainMenuState} from "./internal";

const backMenu: Array<Array<KeyboardButton>> = [
    [{text: 'Вернуться в меню'}],
];

abstract class BaseState {
    public context: StateContext;

    constructor(context: StateContext) {
        this.context = context;
    }

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return this.context.getBot().sendMessage(this.context.getChatId(), message, options || {
            reply_markup: {
                keyboard: backMenu,
                resize_keyboard: true,
            },
            parse_mode: 'Markdown',
        });
    }

    public async onNewMessage(): Promise<any> {
        const stateContext = this.context
        const lastMessageId = stateContext.getLastMessageId();
        if(lastMessageId) {
            await stateContext.getBot().editMessageReplyMarkup({inline_keyboard: []}, {
                chat_id: stateContext.getChatId(),
                message_id: lastMessageId,
            });
        }
    }

    public async initState(): Promise<any> {};

    public async messageController(message: Message): Promise<any> {
        await this.context.initState();
    };

    public async callbackController(callback: CallbackQuery): Promise<any> {};

}

export default BaseState;