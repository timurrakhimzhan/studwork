import {OrdersState, OrderPriceCommentState, AbstractInformatorOrderState} from "./internal";
import {Message} from "node-telegram-bot-api";


export default class OrderSetPriceState extends AbstractInformatorOrderState {

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new OrdersState(this.stateContext));
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