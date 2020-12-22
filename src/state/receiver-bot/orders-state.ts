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

export default class OrdersState extends AbstractOrdersState {
    protected getOrders(): Promise<Array<Order>> {
        return Order.findAll({
            where: {
                chatId: this.stateContext.getChatId(),
                mock: !!process.env['MOCK'],
            },
            include: [Subject, Status, WorkType, ContactOption],
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
        if(orders[this.currentOrderPosition].assignmentUrl) {
            extraInlineMarkup.push([{text: 'Показать прикрепленный файл', callback_data: 'Показать прикрепленный файл'}])
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
        if(callbackData === 'Показать прикрепленный файл') {
            const orders = this.statusOrders[this.currentStatus] as Array<Order>
            const url = orders[this.currentOrderPosition].assignmentUrl;
            if(url) {
                const document = await getBufferFromUrl(url);
                await bot.sendDocument(stateContext.getChatId(), document, {}, {
                    filename: 'Прикрепленный файл к заказу #' + orders[this.currentOrderPosition].orderId,
                });
                await bot.answerCallbackQuery(callback.id);
            }
        }
        return super.callbackController(callback);
    }
}