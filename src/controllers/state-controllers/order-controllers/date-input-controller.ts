import TelegramBot, {LabeledPrice, Message} from "node-telegram-bot-api";
import {receiverSendMessage} from "../../telegram-bot-controllers";
import App from "../../../App";
import {CHOOSE_CONTACT_OPTION, COMMENT_INPUT, PAYMENT, PHONE_INPUT} from "../../../states";
import moment from 'moment';

export const dateInputMessageController = async (bot: TelegramBot, message: Message) => {
    const momentDate = moment(message.text || '', 'DD.MM.YYYY HH:mm:ss')
    if(!momentDate.isValid()) {
        await receiverSendMessage(message.chat.id, 'Некорректный формат даты.\n*Пример корректного формата: 15.12.2020 15:30*. Пожалуйста, повторите попытку.')
        return;
    }
    const app = App.getInstance();
    app.setChatState(message.chat.id, PHONE_INPUT);
    app.getOrderInfo(message.chat.id).setDate(momentDate.format('DD.MM.YYYY HH:mm:ss'));
    await receiverSendMessage(message.chat.id, 'Введите Ваш номер телефона:')
}