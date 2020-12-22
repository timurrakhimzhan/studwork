import {
    CallbackQuery,
    KeyboardButton,
    Message,
    SendMessageOptions
} from "node-telegram-bot-api";
import {AbstractStateContext} from "./internal";

abstract class AbstractBaseState {
    public stateContext: AbstractStateContext;

    constructor(context: AbstractStateContext) {
        this.stateContext = context;
    }

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return this.stateContext.getBotContext().getBot().sendMessage(this.stateContext.getChatId(), message, options || {
            parse_mode: 'Markdown'
        });
    }

    public async onNewMessage(): Promise<any> {
        const stateContext = this.stateContext
        const lastMessageId = stateContext.getLastMessageId();
        if(lastMessageId) {
            try {
                await stateContext.getBotContext().getBot().editMessageReplyMarkup({inline_keyboard: []}, {
                    chat_id: stateContext.getChatId(),
                    message_id: lastMessageId,
                });
            } catch(e) {}

        }
    }

    public async onBackMessage(): Promise<any> {
    }

    public async initState(): Promise<any> {};

    public async messageController(message: Message): Promise<any> {
        await this.stateContext.initState();
    };

    public async callbackController(callback: CallbackQuery): Promise<any> {};

}

export default AbstractBaseState;