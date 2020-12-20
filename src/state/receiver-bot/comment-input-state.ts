import {DateInputState, ReceiverBaseState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";

class CommentInputState extends ReceiverBaseState {
    async initState () {
        await this.stateContext.sendMessage('Оставьте комментарий к заданию:');
    }

    async messageController (message: Message) {
        const stateContext = this.stateContext;
        if(message.text?.trim().length === 0) {
              await stateContext.sendMessage('Комментарий не должен быть пустым.');
              return;
        }
        const botContext = stateContext.getBotContext();
        const order = botContext.getOrderInfo(stateContext.getChatId());
        order.comment = message.text as string;
        await stateContext.setState(new DateInputState(stateContext));
    }
}

export default CommentInputState;