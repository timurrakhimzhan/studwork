
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";
import Order from "../../database/models/Order";
import {AbstractBaseState, AbstractStateContext} from "./internal";
import AbstractOrderState from "./abstract-order-state";

const keyboardMarkup: Array<Array<KeyboardButton>> = [[{text: 'Вернуться в меню'}, {text: 'Назад'}]]
export default abstract class OrderRejectState extends AbstractOrderState {

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options || {
            reply_markup: {
                keyboard: keyboardMarkup,
                resize_keyboard: true,
            }
        });
    }

    public abstract onBackMessage(): Promise<any>;

    protected abstract updateDatabase(rejectionComment: string): Promise<any>;

    protected abstract onSuccess(): Promise<any>;

    async initState(): Promise<any> {
        return this.stateContext.sendMessage('Укажите причину отмены заказа:');
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        if(!message.text?.trim().length) {
           return stateContext.sendMessage('Комментарий должен содержать символы');
        }
        await this.updateDatabase(message.text);
        await stateContext.sendMessage('Заказ успешно отменен!')
        await this.onSuccess();
    }
}