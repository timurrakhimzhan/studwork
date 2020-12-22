import {AbstractOrdersState, InformatorBaseState, InformatorStateContext} from "./internal";
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
                include: [Subject, Status, WorkType, ContactOption],
                limit: 10,
                offset: this.offset
            });
        }
        return Order.findAll({
            include: [Subject, Status, WorkType, ContactOption, {
                model: Teacher,
                where: {teacherId: teacher.teacherId}
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
        if(orders[this.currentOrderPosition].assignmentUrl) {
            extraInlineMarkup.push([{text: 'Показать прикрепленный клиентом файл', callback_data: 'Файл клиента'}])
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
        if(callbackData === 'Файл клиента') {
            const orders = this.statusOrders[this.currentStatus] as Array<Order>
            const url = orders[this.currentOrderPosition].assignmentUrl;
            if(url) {
                const document = await getBufferFromUrl(url);
                await bot.sendDocument(stateContext.getChatId(), document, {}, {
                    filename: 'Прикрепленный клиентом файл к заказу #' + orders[this.currentOrderPosition].orderId,
                });
                await bot.answerCallbackQuery(callback.id);
            }
        }
        return super.callbackController(callback);
    }
}