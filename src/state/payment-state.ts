import {BaseState, MainMenuState} from "./internal";
import {
    informatorSendDocument,
    informatorSendMessage,
} from "../controllers/telegram-bot-controllers";
import {CallbackQuery, LabeledPrice, Message, PreCheckoutQuery} from "node-telegram-bot-api";
import axios from "axios";
import {addOrder} from "../controllers/google-spreadsheet-controller";

class PaymentState extends BaseState {
    private invoiceMessageId: number = 0;
    async initState () {
        const stateContext = this.context;
        const app = stateContext.getApp();
        const paymentToken = process.env['paymentToken'];
        const priceStr = app.getOrderInfo(stateContext.getChatId()).getSubject()?.price;
        const priceNum = parseInt(priceStr || '');
        if(isNaN(priceNum) || !paymentToken) {
            await stateContext.sendMessage('Прозошла непредвиденная ошибка. Свяжитесь с службой поддержки.');
            return;
        }
        const payload = Date.now() + stateContext.getChatId() + '';
        const title = 'Оплата заявки';
        const description = 'Пожалуйста, оплатите ' + priceNum + 'тг, чтобы продолжить.'
        const startParam = 'pay';
        const currency = 'KZT';
        const price: LabeledPrice = {label: priceNum + 'тг', amount: priceNum * 100};

        await stateContext.sendMessage('Спасибо! Ваша заявка будет принята после оплаты.');
        const invoiceMessage = await stateContext.getBot().sendInvoice(stateContext.getChatId(), title, description, payload, paymentToken, startParam, currency, [price]);
        this.invoiceMessageId = invoiceMessage.message_id;
    }

    async messageController(message: Message) {
        const stateContext = this.context;
        if(!message.successful_payment) {
            await stateContext.sendMessage('Произошла ошибка во время оплаты.');
            return;
        }
        const app = stateContext.getApp();
        const order = app.getOrderInfo(stateContext.getChatId());
        await stateContext.sendMessage('Оплата прошла успешно, мы с Вами свяжемся.');
        await stateContext.setState(new MainMenuState(stateContext));
        await informatorSendMessage(app, order.getReceipt());
        const url = order.getUrl();
        if(url) {
            const response = await axios.get(url, {responseType: 'arraybuffer'});
            const document = Buffer.from(response.data, 'binary')
            await informatorSendDocument(app, document);
        }
        await informatorSendMessage(app, '-----------------------------------------------------');
        await addOrder(app.getDoc(), order);
    }

    async onNewMessage(): Promise<any> {
        const stateContext = this.context;
        await stateContext.getBot().deleteMessage(stateContext.getChatId(), this.invoiceMessageId.toString());
    }
}

export default PaymentState;