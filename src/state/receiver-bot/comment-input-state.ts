import {DateInputState, UploadFileState, ReceiverOrderState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";

class CommentInputState extends ReceiverOrderState {
    async initState () {
        await this.stateContext.sendMessage('Оставьте комментарий к заданию:');
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new UploadFileState(this.stateContext, this.order));
    }

    async messageController (message: Message) {
        const stateContext = this.stateContext;
        if(message.text?.trim().length === 0) {
              await stateContext.sendMessage('Комментарий не должен быть пустым.');
              return;
        }
        this.order.comment = message.text as string;
        await stateContext.setState(new DateInputState(stateContext, this.order));
    }
}

export default CommentInputState;