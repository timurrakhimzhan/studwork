import {ReceiverBaseState, MainMenuState} from "./internal";
import {LabeledPrice, Message} from "node-telegram-bot-api";
import axios from "axios";

class PaymentState extends ReceiverBaseState {
    private invoiceMessageId: number = 0;
    async initState () {
        const stateContext = this.stateContext;
        const app = stateContext.getBotContext();
        const paymentToken = process.env['paymentToken'];
        const priceStr = '50000';
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
        const invoiceMessage = await stateContext.getBotContext().getBot().sendInvoice(stateContext.getChatId(), title, description, payload, paymentToken, startParam, currency, [price]);
        this.invoiceMessageId = invoiceMessage.message_id;
    }

    async messageController(message: Message) {
        const stateContext = this.stateContext;
        if(!message.successful_payment) {
            await stateContext.sendMessage('Произошла ошибка во время оплаты.');
            return;
        }
        const botContext = stateContext.getBotContext();
        const order = botContext.getOrderInfo(stateContext.getChatId());
        await stateContext.sendMessage('Оплата прошла успешно, мы с Вами свяжемся.');
        await stateContext.setState(new MainMenuState(stateContext));
        // await informatorSendMessage(botContext, order.getReceipt());
        // const url = order.getUrl();
        // if(url) {
        //     const response = await axios.get(url, {responseType: 'arraybuffer'});
        //     const document = Buffer.from(response.data, 'binary')
        //     // await informatorSendDocument(botContext, document);
        // }
        // await informatorSendMessage(botContext, '-----------------------------------------------------');
        // await addOrder(botContext.getDoc(), order);
    }

    async onNewMessage(): Promise<any> {
        const stateContext = this.stateContext;
        await stateContext.getBotContext().getBot().deleteMessage(stateContext.getChatId(), this.invoiceMessageId.toString());
    }
}

export default PaymentState;