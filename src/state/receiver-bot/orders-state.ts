import {AbstractOrdersState, ReceiverBaseState} from "./internal";
import Order from "../../database/models/Order";
import Status, {statuses, statusMeaningMap, StatusName} from "../../database/models/Status";
import {Sequelize} from "sequelize-typescript";
import {CallbackQuery, InlineKeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";
import ReceiptGenerator from "../../utils/ReceiptGenerator";
import Subject from "../../database/models/Subject";
import WorkType from "../../database/models/WorkType";
import ContactOption from "../../database/models/ContactOption";
import axios from "axios";
import {getBufferFromUrl} from "../../utils/message-utils";
import {
    CALLBACK_CLIENT_FILE,
    CALLBACK_CLIENT_REJECT,
    STATUS_NOT_PAYED,
    STATUS_PRICE_NOT_ASSIGNED
} from "../../constants";
import OrderRejectState from "./order-reject-state";
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

    protected generateReceipt(): string {
        if(!this.currentStatus) {
            return "";
        }
        const orders = this.statusOrders[this.currentStatus] as Array<Order>
        return ReceiptGenerator.generateReceiptForClient(orders[this.currentOrderPosition]);
    }

    protected generateExtraInlineMarkup(): Array<Array<InlineKeyboardButton>> {
        const extraInlineMarkup: Array<Array<InlineKeyboardButton>> = []
        if(!this.currentStatus) {
            return extraInlineMarkup;
        }
        const orders = this.statusOrders[this.currentStatus] as Array<Order>
        const order = orders[this.currentOrderPosition];
        if(order.assignmentUrl) {
            extraInlineMarkup.push([{text: 'Показать прикрепленный файл', callback_data: CALLBACK_CLIENT_FILE}])
        }
        if(order.status.name === STATUS_PRICE_NOT_ASSIGNED || order.status.name === STATUS_NOT_PAYED) {
            extraInlineMarkup.push([{text: 'Отменить заказ', callback_data: CALLBACK_CLIENT_REJECT}])
        }

        return extraInlineMarkup;
    }

    async callbackController(callback: CallbackQuery): Promise<any> {
        const callbackData = callback.data;
        const stateContext = this.stateContext;
        const bot = stateContext.getBotContext().getBot();
        if(!this.currentStatus) {
            return;
        }
        const orders = this.statusOrders[this.currentStatus] as Array<Order>;
        const order = orders[this.currentOrderPosition];
        if(callbackData === CALLBACK_CLIENT_FILE) {
            const url = order.assignmentUrl;
            if(url) {
                const document = await getBufferFromUrl(url);
                await bot.sendDocument(stateContext.getChatId(), document, {}, {
                    filename: 'Прикрепленный файл к заказу #' + order.orderId,
                });
                await bot.answerCallbackQuery(callback.id);
            }
        }
        if(callbackData === CALLBACK_CLIENT_REJECT) {
            await stateContext.setState(new OrderRejectState(stateContext, order));
        }
        return super.callbackController(callback);
    }
}