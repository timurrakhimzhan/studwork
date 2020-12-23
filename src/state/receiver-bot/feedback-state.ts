import {AbstractReceiverBaseState} from "./internal";
import Feedback from "../../database/models/Feedback";
import ReceiverStateContext from "./receiver-state-context";
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";


const keyboardMarkup: Array<Array<KeyboardButton>> = [[{text: 'Вернуться в меню'}]];
export default abstract class FeedbackState extends AbstractReceiverBaseState {
    protected feedback: Feedback;

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options || {
            reply_markup: {
                keyboard: keyboardMarkup,
                resize_keyboard: true
            },
            parse_mode: 'Markdown',
        });
    }

    constructor(stateContext: ReceiverStateContext, feedback: Feedback) {
        super(stateContext);
        this.feedback = feedback;
    }
}