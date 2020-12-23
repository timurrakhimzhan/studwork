import {OrderRejectState, OrderPaymentState, AbstractOrdersState} from "./internal";
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


    protected fetchItems(): Promise<Array<Order>> {
        return Order.findAll({
            where: {
                chatId: this.stateContext.getChatId(),
                mock: !!process.env['MOCK'],
            },
            include: [{
                model: Status,
                where: {
                    name: this.currentCategory
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

    protected fetchStatusCounts(): Promise<Array<Status>> {
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

    protected generateExtraInlineMarkup(order: Order): Array<Array<InlineKeyboardButton>> {
        let extraInlineMarkup: Array<Array<InlineKeyboardButton>> = []
        extraInlineMarkup = [...extraInlineMarkup, ...super.generateExtraInlineMarkup(order)];
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
        if(!this.currentCategory) {
            return;
        }
        await super.callbackController(callback);
        const orders = this.categoryItemsMap[this.currentCategory];
        if(!orders) {
            return;
        }
        const order = orders[this.currentItemPosition];
        if(callbackData === CALLBACK_CLIENT_REJECT) {
            await stateContext.setState(new OrderRejectState(stateContext, order));
        }
        if(callbackData === CALLBACK_PAY) {
            await stateContext.setState(new OrderPaymentState(stateContext, order));
        }
    }
}