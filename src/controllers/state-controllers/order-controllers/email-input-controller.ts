import TelegramBot, {Message} from "node-telegram-bot-api";
import {receiverSendMessage} from "../../telegram-bot-controllers";
import App from "../../../App";
import {CHOOSE_CONTACT_OPTION, EMAIL_INPUT} from "../../../states";

const regex = /\S+@\S+\.\S+/;

export const emailInputMessageController = async (bot: TelegramBot, message: Message) => {
    if(!message.text || !regex.test(message.text)) {
        await receiverSendMessage(message.chat.id, 'Некорректный адрес электронной почты, пожалуйста, повторите попытку.')
        return;
    }
    const app = App.getInstance();
    app.setChatState(message.chat.id, CHOOSE_CONTACT_OPTION);
    app.getOrderInfo(message.chat.id).setEmail(message.text);
    await receiverSendMessage(message.chat.id, 'Куда Ваc оповестить о завершение работы?');
}