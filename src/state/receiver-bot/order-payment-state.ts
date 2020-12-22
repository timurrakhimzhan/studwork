import Order from "../../database/models/Order";
import {LabeledPrice, Message} from "node-telegram-bot-api";
import {OrdersState, ReceiverStateContext, AbstractOrderState} from "./internal";
import Status from "../../database/models/Status";
import {STATUS_PAYED} from "../../constants";

export default class OrderPaymentState extends AbstractOrderState {
    stateContext: ReceiverStateContext;
    private invoiceMessageIdToDelete: number | null ;
    constructor(stateContext: ReceiverStateContext, order: Order) {
        super(stateContext, order);
        this.stateContext = stateContext;
        this.invoiceMessageIdToDelete = null;
    }

    async initState(): Promise<any> {
        const stateContext = this.stateContext;
        const paymentToken = process.env['MOCK'] ? process.env['TG_PAYMENT_TOKEN_MOCK'] : process.env['TG_PAYMENT_TOKEN'];
        const priceNum = this.order.price;
        if(!priceNum || !paymentToken) {
            await stateContext.sendMessage('Прозошла непредвиденная ошибка. Свяжитесь с службой поддержки.');
            return;
        }
        const payload = Date.now() + stateContext.getChatId() + '';
        const title = 'Оплата заявки';
        const description = 'Пожалуйста, оплатите ' + priceNum + 'тг, чтобы продолжить.'
        const startParam = 'pay';
        const currency = 'KZT';
        const price: LabeledPrice = {label: priceNum + ' тг ', amount: priceNum * 100};
        try {
            const invoiceMessage = await stateContext.getBotContext().getBot().sendInvoice(stateContext.getChatId(), title, description, payload, paymentToken, startParam, currency, [price]);
            await super.onNewMessage();
            this.invoiceMessageIdToDelete = invoiceMessage.message_id;
        } catch (e) {
            await stateContext.sendMessage('Прозошла непредвиденная ошибка. Свяжитесь с службой поддержки.');
            await stateContext.setState(new OrdersState(stateContext));
        }

    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        if(!message.successful_payment) {
            await stateContext.sendMessage('Произошла ошибка во время оплаты.');
            return stateContext.setState(new OrdersState(stateContext));
        }
        const status = await Status.findOne({ where: {name: STATUS_PAYED }});
        if(!status) {
            const stateContext = this.stateContext;
            await stateContext.sendMessage('Ошибка сервера, пожалуйста, повторите позже');
            return stateContext.setState(new OrdersState(stateContext));
        }
        await this.order.$set('status', status);
        this.invoiceMessageIdToDelete = null;
        await stateContext.sendMessage('Оплата прошла успешно, мы с Вами свяжемся.');
        await stateContext.setState(new OrdersState(stateContext));
    }

    async onNewMessage(): Promise<any> {
        await super.onNewMessage();
        if(!this.invoiceMessageIdToDelete) {
            return;
        }
        try {
            const stateContext = this.stateContext;
            await stateContext.getBotContext().getBot().deleteMessage(stateContext.getChatId(), this.invoiceMessageIdToDelete.toString());
        } catch (e) {}
    }

}