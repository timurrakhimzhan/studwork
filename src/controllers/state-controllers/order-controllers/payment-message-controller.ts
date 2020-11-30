import TelegramBot, {Message} from "node-telegram-bot-api";
import {informatorSendDocument, informatorSendMessage, receiverSendMessage} from "../../telegram-bot-controllers";
import {MAIN_MENU} from "../../../states";
import App from "../../../App";
import axios from "axios";
import {addOrder} from "../../google-spreadsheet-controller";

export const paymentMessageController = async (bot: TelegramBot, message: Message) => {
    if(!message.successful_payment) {
        await receiverSendMessage(message.chat.id, 'Произошла ошибка во время оплаты.');
        return;
    }
    const app = App.getInstance();
    const order = app.getOrderInfo(message.chat.id);
    app.setChatState(message.chat.id, MAIN_MENU);
    await receiverSendMessage(message.chat.id, 'Оплата прошла успешно, мы с Вами свяжемся.');
    await informatorSendMessage(order.getReceipt());
    const response = await axios.get(order.getUrl() as string, {responseType: 'arraybuffer'});
    const document = Buffer.from(response.data, 'binary')
    await informatorSendDocument(document);
    await informatorSendMessage('----------------------------------');
    await addOrder(order);
    await app.resetOrderInfo(message.chat.id);
};