import {AbstractReceiverBaseState, CommentInputState, AbstractReceiverOrderState, ChooseWorkTypeState} from "./internal";
import {Message} from "node-telegram-bot-api";
import File from "../../database/models/File";
import {extractFileInfo} from "../../utils/extract-file-info";

class UploadFileState extends AbstractReceiverOrderState {
     async initState() {
        await this.stateContext.sendMessage('Прикрепите файл (фотографию, документ, либо архив файлов) либо укажите тему работы:');
    }

    async onBackMessage(): Promise<any> {
        this.order.assignmentFile = null;
        return this.stateContext.setState(new ChooseWorkTypeState(this.stateContext, this.order));
    }

    async messageController(message: Message) {
        if(this.order.assignmentFile) {
            return;
        }
        const stateContext = this.stateContext;
        const bot = stateContext.getBotContext().getBot();
        if(!message.photo && !message.document && !message.text) {
            await stateContext.sendMessage('Нужно прикрепить фотографию/документ/архив, либо указать тему работы, чтобы продолжить. (Если у вас несколько фотографий, прикрепите архив)');
            return;
        }
        let topic: string | null = message.text || null;
        let {url, fileId} = await extractFileInfo(bot, message);
        if(!fileId && !topic) {
            await stateContext.sendMessage('Ошибка ввода. Нужно прикрепить фотографию/документ/архив, либо указать тему работы, пожалуйста, повторите попытку.');
            return;
        }
        this.order.topic = topic;
        if(url) {
            const file = new File();
            file.url = url;
            file.receiverFileId = fileId;
            this.order.assignmentFile = file;
        }
        await stateContext.setState(new CommentInputState(stateContext, this.order));
    }
}

export default UploadFileState;