import {AbstractInformatorOrderState, OrderSolutionCommentState} from "./internal";
import {Message} from "node-telegram-bot-api";


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
        let url: string | null = null;
        if(message.photo) {
            url = await bot.getFileLink(message.photo[message.photo.length - 1].file_id);
        } else if(message.document) {
            url = await bot.getFileLink(message.document.file_id);
        }
        if(!url) {
            await stateContext.sendMessage('Ошибка ввода. Нужно прикрепить фотографию/документ/архив, пожалуйста, повторите попытку.');
            return;
        }
        this.order.solutionUrl = url;
        await stateContext.setState(new OrderSolutionCommentState(stateContext, this.order))
    }
}