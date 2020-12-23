import {AbstractReceiverBaseState, CommentInputState, AbstractReceiverOrderState, ChooseWorkTypeState} from "./internal";
import {Message} from "node-telegram-bot-api";

class UploadFileState extends AbstractReceiverOrderState {
     async initState() {
        await this.stateContext.sendMessage('Прикрепите файл (фотографию, документ, либо архив файлов) либо укажите тему работы:');
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new ChooseWorkTypeState(this.stateContext, this.order));
    }

    async messageController(message: Message) {
        const stateContext = this.stateContext;
        const bot = stateContext.getBotContext().getBot();
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
        this.order.topic = topic;
        this.order.assignmentUrl = url;
        await stateContext.setState(new CommentInputState(stateContext, this.order));
    }
}

export default UploadFileState;