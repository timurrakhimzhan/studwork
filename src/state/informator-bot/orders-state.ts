import {AbstractOrdersState, InformatorBaseState, InformatorStateContext, OrderRejectState} from "./internal";
import Status from "../../database/models/Status";
import {Sequelize} from "sequelize-typescript";
import Order from "../../database/models/Order";
import Teacher from "../../database/models/Teacher";
import Subject from "../../database/models/Subject";
import WorkType from "../../database/models/WorkType";
import ContactOption from "../../database/models/ContactOption";
import ReceiptGenerator from "../../utils/ReceiptGenerator";
import {CallbackQuery, InlineKeyboardButton} from "node-telegram-bot-api";
import {getBufferFromUrl} from "../../utils/message-utils";
import {
    CALLBACK_CLIENT_FILE,
    CALLBACK_SET_PRICE, CALLBACK_TEACHER_REJECT,
    STATUS_NOT_PAYED,
    STATUS_PRICE_NOT_ASSIGNED
} from "../../constants";
import OrderSetPriceState from "./order-set-price-state";

export default class OrdersState extends AbstractOrdersState {
    stateContext: InformatorStateContext;
    constructor(stateContext: InformatorStateContext) {
        super(stateContext);
        this.stateContext = stateContext;
    }
    protected getStatusCounts(): Promise<Array<Status>> {
        const teacher = this.stateContext.getTeacher();
        if(teacher.isAdmin) {
            return Status.findAll({
                attributes: ['statusId', 'name',
                    [Sequelize.fn('count', Sequelize.col('orders.orderId')), 'ordersCount']
                ],
                group: 'Status.statusId',
                include: [{ model: Order, attributes: [], required: false,
                    where: {
                        mock: !!process.env['MOCK'],
                    }
                }],
            });
        }
        return Status.findAll({
            attributes: ['statusId', 'name',
                [Sequelize.fn('count', Sequelize.col('orders.orderId')), 'ordersCount']
            ],
            group: 'Status.statusId',
            include: [{ model: Order, attributes: [], required: false,
                where: {
                    mock: !!process.env['MOCK'],
                },
                include: [{ model: Teacher, attributes: [],
                    where: {
                        teacherId: teacher.teacherId
                    }
                }]
            }],
        });
    }

    protected getOrders(): Promise<Array<Order>> {
        const teacher = this.stateContext.getTeacher();
        if(teacher.isAdmin) {
            return Order.findAll({
                include: [Subject, ContactOption, Teacher, {
                    model: Status,
                    where: { name: this.currentStatus },
                }, {
                    model: WorkType,
                    include: [{
                        model: Subject,
                    }]
                }],
                limit: 10,
                offset: this.offset
            });
        }
        return Order.findAll({
            include: [Subject, ContactOption,
            {
                model: Status,
                where: { name: this.currentStatus },
            },
            {
                model: Teacher,
                where: {teacherId: teacher.teacherId}
            },
            {
                model: WorkType,
                include: [{
                    model: Subject,
                }]
            }],
            limit: 10,
            offset: this.offset
        });
    }

    protected generateReceipt(): string {
        if(!this.currentStatus) {
            return "";
        }
        const orders = this.statusOrders[this.currentStatus] as Array<Order>
        return ReceiptGenerator.generateReceiptForTeacher(orders[this.currentOrderPosition]);
    }

    protected generateExtraInlineMarkup(): Array<Array<InlineKeyboardButton>> {
        const extraInlineMarkup: Array<Array<InlineKeyboardButton>> = []
        if(!this.currentStatus) {
            return extraInlineMarkup;
        }
        const orders = this.statusOrders[this.currentStatus] as Array<Order>
        const order = orders[this.currentOrderPosition];
        if(order.assignmentUrl) {
            extraInlineMarkup.push([{text: 'Показать прикрепленный клиентом файл', callback_data: CALLBACK_CLIENT_FILE}])
        }
        if(order.status.name === STATUS_PRICE_NOT_ASSIGNED) {
            extraInlineMarkup.push([{text: 'Установить цену', callback_data: CALLBACK_SET_PRICE}])
            extraInlineMarkup.push([{text: 'Отменить заказ', callback_data: CALLBACK_TEACHER_REJECT}])
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
        const orders = this.statusOrders[this.currentStatus] as Array<Order>
        const order = orders[this.currentOrderPosition];
        if(callbackData === CALLBACK_CLIENT_FILE) {
            const orders = this.statusOrders[this.currentStatus] as Array<Order>
            const url = order.assignmentUrl;
            if(url) {
                const document = await getBufferFromUrl(url);
                await bot.sendDocument(stateContext.getChatId(), document, {}, {
                    filename: 'Прикрепленный клиентом файл к заказу #' + orders[this.currentOrderPosition].orderId,
                });
                await bot.answerCallbackQuery(callback.id);
            }
        }
        if(callbackData === CALLBACK_SET_PRICE) {
            await stateContext.setState(new OrderSetPriceState(stateContext, order));
        }
        if(callbackData === CALLBACK_TEACHER_REJECT) {
            await stateContext.setState(new OrderRejectState(stateContext, order));
        }
        return super.callbackController(callback);
    }
}