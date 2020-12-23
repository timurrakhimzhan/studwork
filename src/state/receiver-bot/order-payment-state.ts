import Order from "../../database/models/Order";
import {LabeledPrice, Message, SendMessageOptions} from "node-telegram-bot-api";
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

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        await this.deleteInvoice();
        return super.sendMessage(message, options);
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
            await this.onNewMessage();
            this.invoiceMessageIdToDelete = invoiceMessage.message_id;
        } catch (e) {
            await stateContext.sendMessage('Прозошла непредвиденная ошибка. Свяжитесь с службой поддержки.');
            await stateContext.setState(new OrdersState(stateContext));
        }

    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        if(!message.successful_payment) {
            await stateContext.sendMessage('Произошла ошибка во время оплаты. Пожалуйста, повторите позже');
            return stateContext.setState(new OrdersState(stateContext));
        }
        const statuses = stateContext.getBotContext().getStatuses();
        const statusFound = statuses.find((status) => status.name === STATUS_PAYED)
        if(!statusFound) {
            const stateContext = this.stateContext;
            await stateContext.sendMessage('Ошибка сервера, пожалуйста, повторите позже');
            return stateContext.setState(new OrdersState(stateContext));
        }
        await this.order.$set('status', statusFound);
        this.invoiceMessageIdToDelete = null;
        await stateContext.sendMessage('Оплата прошла успешно, мы с Вами свяжемся.');
        await stateContext.setState(new OrdersState(stateContext));
    }

    async deleteInvoice(): Promise<any> {
        if(!this.invoiceMessageIdToDelete) {
            return;
        }
        try {
            await this.stateContext.getBotContext().getBot().deleteMessage(this.stateContext.getChatId(), this.invoiceMessageIdToDelete.toString());
        } catch (e) {}
    }

}