import {AbstractInformatorOrderState, OrderSolutionCommentState} from "./internal";
import {Message} from "node-telegram-bot-api";
import {extractFileInfo} from "../../utils/extract-file-info";
import File from "../../database/models/File";


export default class OrderUploadSolutionState extends AbstractInformatorOrderState {

    async initState(): Promise<any> {
        return this.stateContext.sendMessage('Прикрепите файл с выполненным заданием (фотографию, документ, либо архив файлов):');
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        const bot = stateContext.getBotContext().getBot();
        if(!message.photo && !message.document) {
            return  stateContext.sendMessage('Нужно прикрепить фотографию/документ/архив, чтобы продолжить.');
        }
        let {url, fileId} = await extractFileInfo(bot, message);
        if(!url || !fileId) {
            await stateContext.sendMessage('Ошибка ввода. Нужно прикрепить фотографию/документ/архив, пожалуйста, повторите попытку.');
            return;
        }
        const file = new File();
        file.url = url;
        file.informatorFileId = fileId;
        this.order.solutionFile = file;
        await stateContext.setState(new OrderSolutionCommentState(stateContext, this.order))
    }
}