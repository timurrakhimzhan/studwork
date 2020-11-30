import TelegramBot, {Message} from "node-telegram-bot-api";
import App from "../../../App";
import {COMMENT_INPUT, PHONE_INPUT} from "../../../states";
import {receiverSendMessage} from "../../telegram-bot-controllers";

export const uploadFileMessageController = async (bot: TelegramBot, message: Message) => {
    let url: string | null = null;
    if(message.photo) {
        url = await bot.getFileLink(message.photo[message.photo.length - 1].file_id);
    } else if(message.document) {
        url = await bot.getFileLink(message.document.file_id);
    } else {
        await receiverSendMessage(message.chat.id, 'Нужно прикрепить фотографию, документ, либо архив, чтобы продолжить.');
        return;
    }
    if(!url) {
        await receiverSendMessage(message.chat.id, 'Ошибка при получении файла, пожалуйста, повторите попытку.');
        return;
    }
    const app = App.getInstance();
    app.setChatState(message.chat.id, COMMENT_INPUT);
    app.getOrderInfo(message.chat.id).setUrl(url);
    await receiverSendMessage(message.chat.id, 'Оставьте комментарий к заданию:');
}