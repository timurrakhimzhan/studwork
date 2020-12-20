import {
    CallbackQuery,
    KeyboardButton,
    Message,
    SendMessageOptions
} from "node-telegram-bot-api";
import {AbstractStateContext} from "./internal";

const backMenu: Array<Array<KeyboardButton>> = [
    [{text: 'Вернуться в меню'}],
];

abstract class AbstractBaseState {
    public stateContext: AbstractStateContext;

    constructor(context: AbstractStateContext) {
        this.stateContext = context;
    }

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return this.stateContext.getBotContext().getBot().sendMessage(this.stateContext.getChatId(), message, options || {
            reply_markup: {
                keyboard: backMenu,
                resize_keyboard: true,
            },
            parse_mode: 'Markdown',
        });
    }

    public async onNewMessage(): Promise<any> {
        const stateContext = this.stateContext
        const lastMessageId = stateContext.getLastMessageId();
        if(lastMessageId) {
            await stateContext.getBotContext().getBot().editMessageReplyMarkup({inline_keyboard: []}, {
                chat_id: stateContext.getChatId(),
                message_id: lastMessageId,
            });
        }
    }

    public async initState(): Promise<any> {};

    public async messageController(message: Message): Promise<any> {
        await this.stateContext.initState();
    };

    public async callbackController(callback: CallbackQuery): Promise<any> {};

}

export default AbstractBaseState;