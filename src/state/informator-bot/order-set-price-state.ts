import {InformatorBaseState, OrdersState} from "./internal";
import Order from "../../database/models/Order";
import InformatorStateContext from "./informator-state-context";
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";
import OrderPriceCommentState from "./order-price-comment-state";


const keyboardMarkup: Array<Array<KeyboardButton>> = [[{text: 'Вернуться в меню'}, {text: 'Назад'}]]
export default class OrderSetPriceState extends InformatorBaseState {
    private readonly order: Order
    constructor(stateContext: InformatorStateContext, order: Order) {
        super(stateContext);
        this.order = order;
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new OrdersState(this.stateContext));
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
        const subject = this.order.workType.subjects.find((subject) => subject.name === this.order.subject.name);
        const minPrice = subject?.SubjectWorkType?.minPrice;
        if(!minPrice) {
            return this.stateContext.sendMessage( `Укажите цену заказа. Минимальную цену данного типа работы согласно прайс-листу найти в базе данных не удалось. Обратитесь в службу поддержки`)
        }
        return this.stateContext.sendMessage( `Укажите цену заказа. Минимальная цена данного типа работы согласно прайс-листу: ${minPrice}`)
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        const price = parseInt(message.text || '');
        if(isNaN(price)) {
            return stateContext.sendMessage('Некорректный ввод, пожалуйста, введите число.')
        }
        const subject = this.order.workType.subjects.find((subject) => subject.name === this.order.subject.name);
        const minPrice = subject?.SubjectWorkType?.minPrice;
        if(minPrice && price < minPrice) {
            return stateContext.sendMessage(`Цена должна быть больше или равной указанной в прайс-листе. Цена указанная в прайс листе: ${minPrice}`)
        }
        this.order.price = price;
        await stateContext.setState(new OrderPriceCommentState(stateContext, this.order));
    }


}