import {AbstractBaseState} from "./internal";
import Order from "../../database/models/Order";
import AbstractStateContext from "../abstract-state-context";
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";

const keyboardMarkup: Array<Array<KeyboardButton>> = [[{text: 'Вернуться в меню'}, {text: 'Назад'}]]
export default class AbstractOrderState extends AbstractBaseState {
    protected order: Order;

    constructor(stateContext: AbstractStateContext, order: Order) {
        super(stateContext);
        this.order = order;
    }

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options || {
            reply_markup: {
                keyboard: keyboardMarkup,
                resize_keyboard: true,
            },
            parse_mode: 'Markdown',
        })
    }
}