import {ReceiverStateContext, AbstractBaseState} from "./internal";
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";
const backMenu: Array<Array<KeyboardButton>> = [
    [{text: 'Вернуться в меню'}],
];

export default class ReceiverBaseState extends AbstractBaseState {
    stateContext: ReceiverStateContext;
    constructor(context: ReceiverStateContext) {
        super(context);
        this.stateContext = context;
    }

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options ||  {
            reply_markup: {
                keyboard: backMenu,
                resize_keyboard: true,
            },
            parse_mode: 'Markdown',
        });
    }
}