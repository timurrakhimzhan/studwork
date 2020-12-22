import {InformatorBaseState, OrdersState} from "./internal";
import InformatorStateContext from "./informator-state-context";
import Order from "../../database/models/Order";
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";
import OrderSetPriceState from "./order-set-price-state";
import Status from "../../database/models/Status";
import {STATUS_NOT_PAYED, STATUS_REJECTED_BY_CLIENT} from "../../constants";


const keyboardMarkup: Array<Array<KeyboardButton>> = [[{text: 'Вернуться в меню'}, {text: 'Назад'}],
    [{text: 'Вернуться к списку заказов'}]];

export default class OrderPriceCommentState extends InformatorBaseState {
    private readonly order: Order;
    constructor(stateContext: InformatorStateContext, order: Order) {
        super(stateContext);
        this.order = order;
    }

    async onBackMessage(): Promise<any> {
        await this.resetOrderPrice();
        return this.stateContext.setState(new OrderSetPriceState(this.stateContext, this.order))
    }

    async resetOrderPrice(): Promise<any> {
        this.order.price = null;
        this.order.priceComment = null;
    }

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options || {
            reply_markup: {
                keyboard: keyboardMarkup,
                resize_keyboard: true,
            },
        })
    }

    async initState(): Promise<any> {
        return this.stateContext.sendMessage( `Укажите комментарий к указанной Вам цене:`)
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        if(message.text?.trim() === 'Вернуться к списку заказов') {
            return stateContext.setState(new OrdersState(stateContext));
        }
        if(!message.text?.trim().length) {
            return stateContext.sendMessage('Комментарий должен содержать символы');
        }
        this.order.priceComment = message.text;
        const status = await Status.findOne({ where: {name: STATUS_NOT_PAYED }});
        if(!status) {
            const stateContext = this.stateContext;
            await stateContext.sendMessage('Ошибка сервера, пожалуйста, повторите позже');
            return stateContext.setState(new OrdersState(stateContext));
        }
        await this.order.$set('status', status);
        await stateContext.sendMessage('Цена успешно установлена!');
        return stateContext.setState(new OrdersState(stateContext));
    }
}