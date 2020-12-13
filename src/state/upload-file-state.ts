import {BaseState, CommentInputState} from "./internal";
import {Message} from "node-telegram-bot-api";
import OrderInfo from "../OrderInfo";

class UploadFileState extends BaseState {
     async initState() {
        await this.context.sendMessage('Прикрепите файл (фотографию, документ, либо архив файлов) либо укажите тему работы:');
    }

    async messageController(message: Message) {
        const stateContext = this.context;
        const bot = stateContext.getBot();
        if(!message.photo && !message.document && !message.text) {
            await stateContext.sendMessage('Нужно прикрепить фотографию/документ/архив, либо указать тему работы, чтобы продолжить.');
            return;
        }
        let url: string | null = null;
        let topic: string | null = message.text || '';
        if(message.photo) {
            url = await bot.getFileLink(message.photo[message.photo.length - 1].file_id);
        } else if(message.document) {
            url = await bot.getFileLink(message.document.file_id);
        }
        if(!url && !topic) {
            await stateContext.sendMessage('Ошибка ввода. Нужно прикрепить фотографию/документ/архив, либо указать тему работы, пожалуйста, повторите попытку.');
            return;
        }
        const app = stateContext.getApp();
        const order: OrderInfo = app.getOrderInfo(stateContext.getChatId());
        order.setUrl(url || '');
        order.setTopic(topic);

        await stateContext.setState(new CommentInputState(stateContext));
    }
}

export default UploadFileState;