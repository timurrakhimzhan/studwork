import {BaseState, DateInputState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";

class CommentInputState extends BaseState {
    async initState () {
        await this.context.sendMessage('Оставьте комментарий к заданию:');
    }

    async messageController (message: Message) {
        const stateContext = this.context;
        const app = stateContext.getApp();
        app.getOrderInfo(stateContext.getChatId()).setComment(message.text || '');
        await stateContext.setState(new DateInputState(stateContext));
    }
}

export default CommentInputState;