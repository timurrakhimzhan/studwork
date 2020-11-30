import TelegramBot, {LabeledPrice, Message} from "node-telegram-bot-api";
import {receiverSendMessage} from "../../telegram-bot-controllers";
import App from "../../../App";
import {DATE_INPUT, PAYMENT, PHONE_INPUT} from "../../../states";

export const commentInputMessageController = async (bot: TelegramBot, message: Message) => {
    const app = App.getInstance();
    app.getOrderInfo(message.chat.id).setComment(message.text || '');
    app.setChatState(message.chat.id, DATE_INPUT);
    await receiverSendMessage(message.chat.id, 'Когда вам сдать работу? *Пример корректного формата: 15.12.2020 15:30*');
}