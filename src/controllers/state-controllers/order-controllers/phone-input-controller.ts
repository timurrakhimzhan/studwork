import TelegramBot, {Message} from "node-telegram-bot-api";
import {receiverSendMessage} from "../../telegram-bot-controllers";
import App from "../../../App";
import {EMAIL_INPUT} from "../../../states";

export const phoneInputMessageController = async (bot: TelegramBot, message: Message) => {
    if(message.text?.trim().slice(0, 2) !== '+7' || message.text?.trim().length !== 12) {
        await receiverSendMessage(message.chat.id, 'Некорректный номер телефона, *номер должен начинаться на +7*, пожалуйста, повторите попытку.')
        return;
    }
    const app = App.getInstance();
    app.setChatState(message.chat.id, EMAIL_INPUT);
    app.getOrderInfo(message.chat.id).setPhone(message.text);
    await receiverSendMessage(message.chat.id, 'Введите адрес электронной почты:');
}