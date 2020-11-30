import TelegramBot, {Message} from "node-telegram-bot-api";
import {receiverSendMessage} from "../../telegram-bot-controllers";
import App from "../../../App";
import {CHOOSE_SUBJECT} from "../../../states";

export const nameInputMessageController = async (bot: TelegramBot, message: Message) => {
    if(!message.text) {
        await receiverSendMessage(message.chat.id, 'Некорректно введено имя, пожалуйста, повторите попытку.');
        return;
    }
    const app = App.getInstance();
    const order = app.getOrderInfo(message.chat.id);
    app.setChatState(message.chat.id, CHOOSE_SUBJECT);
    order.setName(message.text);
    order.setUserName(message.chat.username || 'Юзернейм не указан');
    await receiverSendMessage(message.chat.id, 'Выберите предмет:');
}