import TelegramBot, {CallbackQuery} from "node-telegram-bot-api";
import App from "../../../App";
import {UPLOAD_FILE} from "../../../states";
import {receiverSendMessage} from "../../telegram-bot-controllers";

export const chooseSubjectCallbackController = async (bot: TelegramBot, callback: CallbackQuery) => {
    if(!callback.message || !callback.data) {
        return;
    }
    const app = App.getInstance()
    const callbackSubject: string = callback.data;
    const subjectFound = app.getSubjects().find((subject) => subject.name === callbackSubject);
    if(subjectFound) {
        app.setChatState(callback.message.chat.id, UPLOAD_FILE);
        app.getOrderInfo(callback.message.chat.id).setSubject(subjectFound);
        await bot.answerCallbackQuery(callback.id, {text: `Выбран предмет: ${callbackSubject}.`, show_alert: true});
        await receiverSendMessage(callback.message.chat.id, 'Прикрепите файл (фотографию, документ, либо архив файлов):');
    } else {
        await receiverSendMessage(callback.message.chat.id, 'Произошла ошибка во время выбора предмета, пожалуйста, повторите попытку.')
    }
}