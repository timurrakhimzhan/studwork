import {ReceiverBaseState, CommentInputState} from "./internal";
import {Message} from "node-telegram-bot-api";
import OrderInfo from "../../bot-contexts/receiver-bot/order-info";
import Order from "../../database/models/Order";

class UploadFileState extends ReceiverBaseState {
     async initState() {
        await this.stateContext.sendMessage('Прикрепите файл (фотографию, документ, либо архив файлов) либо укажите тему работы:');
    }

    async messageController(message: Message) {
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const bot = botContext.getBot();
        if(!message.photo && !message.document && !message.text) {
            await stateContext.sendMessage('Нужно прикрепить фотографию/документ/архив, либо указать тему работы, чтобы продолжить.');
            return;
        }
        let url: string | null = null;
        let topic: string | null = message.text || null;
        if(message.photo) {
            url = await bot.getFileLink(message.photo[message.photo.length - 1].file_id);
        } else if(message.document) {
            url = await bot.getFileLink(message.document.file_id);
        }
        if(!url && !topic) {
            await stateContext.sendMessage('Ошибка ввода. Нужно прикрепить фотографию/документ/архив, либо указать тему работы, пожалуйста, повторите попытку.');
            return;
        }
        const order: Order = botContext.getOrderInfo(stateContext.getChatId());
        order.topic = topic;
        order.assignmentUrl = url;
        await stateContext.setState(new CommentInputState(stateContext));
    }
}

export default UploadFileState;