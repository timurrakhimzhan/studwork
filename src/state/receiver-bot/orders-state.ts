import {AbstractOrdersState, OrderRejectState, OrderPaymentState} from "./internal";
import Order from "../../database/models/Order";
import Status from "../../database/models/Status";
import {Sequelize} from "sequelize-typescript";
import {CallbackQuery, InlineKeyboardButton,} from "node-telegram-bot-api";
import Subject from "../../database/models/Subject";
import WorkType from "../../database/models/WorkType";
import ContactOption from "../../database/models/ContactOption";
import {
    CALLBACK_CLIENT_REJECT, CALLBACK_PAY,
    STATUS_NOT_PAYED,
    STATUS_PRICE_NOT_ASSIGNED
} from "../../constants";
import ReceiverStateContext from "./receiver-state-context";

export default class OrdersState extends AbstractOrdersState {
    stateContext: ReceiverStateContext;

    constructor(stateContext: ReceiverStateContext) {
        super(stateContext);
        this.stateContext = stateContext;
    }

    protected getOrders(): Promise<Array<Order>> {
        return Order.findAll({
            where: {
                chatId: this.stateContext.getChatId(),
                mock: !!process.env['MOCK'],
            },
            include: [{
                model: Status,
                where: {
                    name: this.currentStatus
                },
            }, {
                model: WorkType,
                include: [{
                    model: Subject,
                }]
            }, Subject, ContactOption],
            order: Sequelize.literal('"Order"."orderId" DESC'),
            limit: 10,
            offset: this.offset
        });
    }

    protected getStatusCounts(): Promise<Array<Status>> {
        return Status.findAll({
            attributes: ['statusId', 'name',
                [Sequelize.fn('count', Sequelize.col('orders.orderId')), 'ordersCount']
            ],
            group: 'Status.statusId',
            include: [{
                model: Order, attributes: [], required: false,
                where: {
                    chatId: this.stateContext.getChatId(),
                    mock: !!process.env['MOCK'],
                },
            }],
        });
    }

    protected generateExtraInlineMarkup(): Array<Array<InlineKeyboardButton>> {
        const extraInlineMarkup: Array<Array<InlineKeyboardButton>> = []
        if(!this.currentStatus) {
            return extraInlineMarkup;
        }
        const orders = this.statusOrders[this.currentStatus] as Array<Order>
        const order = orders[this.currentOrderPosition];

        if(order.status.name === STATUS_NOT_PAYED) {
            extraInlineMarkup.push([{text: 'Оплатить заказ', callback_data: CALLBACK_PAY}])
        }
        if(order.status.name === STATUS_PRICE_NOT_ASSIGNED || order.status.name === STATUS_NOT_PAYED) {
            extraInlineMarkup.push([{text: 'Отменить заказ', callback_data: CALLBACK_CLIENT_REJECT}])
        }
        return extraInlineMarkup;
    }

    async callbackController(callback: CallbackQuery): Promise<any> {
        const callbackData = callback.data;
        const stateContext = this.stateContext;
        if(!this.currentStatus) {
            return;
        }
        const orders = this.statusOrders[this.currentStatus] as Array<Order>;
        const order = orders[this.currentOrderPosition];
        if(callbackData === CALLBACK_CLIENT_REJECT) {
            await stateContext.setState(new OrderRejectState(stateContext, order));
        }
        if(callbackData === CALLBACK_PAY) {
            await stateContext.setState(new OrderPaymentState(stateContext, order));
        }

        return super.callbackController(callback);
    }
}