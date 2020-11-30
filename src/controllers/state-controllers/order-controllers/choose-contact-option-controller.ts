import TelegramBot, {CallbackQuery, LabeledPrice} from "node-telegram-bot-api";
import {receiverSendMessage} from "../../telegram-bot-controllers";
import App from "../../../App";
import {DATE_INPUT, PAYMENT} from "../../../states";

export const chooseContactOptionCallbackController = async (bot: TelegramBot, callback: CallbackQuery) => {
    if(!callback.message || !callback.data) {
        return;
    }
    const callbackOption: string = callback.data;
    if(callbackOption !== 'Телефон' && callbackOption !== 'Почта') {
        await receiverSendMessage(callback.message.chat.id, 'Ошибка при выборе варианта связи, пожалуйста. повторите попытку.')
        return;
    }
    const app = App.getInstance();
    const message = callback.message;
    app.getOrderInfo(callback.message.chat.id).setContactOption(callbackOption);
    await bot.answerCallbackQuery(callback.id, {text: `Выбран вариант: "${callbackOption}"`, show_alert: true});

    const stripeToken = '410694247:TEST:6839b6be-2040-4da8-b100-2e2d3d0635d1';
    const priceStr = app.getOrderInfo(message.chat.id).getSubject()?.price;
    const priceNum = parseInt(priceStr || '');
    if(isNaN(priceNum)) {
        await receiverSendMessage(message.chat.id, 'Прозошла непредвиденная ошибка. Свяжитесь с службой поддержки.:');
        return;
    }
    const payload = Date.now() + message.chat.id + '';
    const title = 'Оплата заявки';
    const description = 'Пожалуйста, оплатите ' + priceNum + 'тг, чтобы продолжить'
    const startParam = 'pay';
    const currency = 'KZT';
    const price: LabeledPrice = {label: priceNum + 'тг', amount: priceNum * 100};
    app.setChatState(message.chat.id, PAYMENT);
    await receiverSendMessage(message.chat.id, 'Спасибо! Ваша заявка будет принята послее оплаты.')
    await bot.sendInvoice(message.chat.id, title, description, payload, stripeToken, startParam, currency, [price]);
}