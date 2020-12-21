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

export default class OrdersState extends AbstractOrdersState {
    protected getOrders(): Promise<Array<Order>> {
        return Order.findAll({
            where: {
                chatId: this.stateContext.getChatId()
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
            include: [{ model: Order, attributes: [], where: { chatId: this.stateContext.getChatId() }, required: false,}],
        });
    }

    protected async showReceipt(editCurrentMessage?: boolean): Promise<void> {
        if(!this.currentStatus) {
            return;
        }
        const stateContext = this.stateContext;
        const bot = stateContext.getBotContext().getBot();
        let inlineMarkup = [[{text: '⬅️ Назад', callback_data: 'Назад'}, {text: 'Вперед ➡️', callback_data: 'Вперед'}]]
        if(this.statusCount[this.currentStatus] === 0) {
            return stateContext.sendMessage('Список заказов пуст.');
        }
        if(this.currentOrderPosition === 0) {
            inlineMarkup[0].shift();
        }
        if(this.currentOrderPosition + 1 === this.statusCount[this.currentStatus]) {
            inlineMarkup[0].pop();
        }
        await this.fetchReceipts(this.currentStatus);
        const orders = this.statusOrders[this.currentStatus] as Array<Order>
        const receipt = ReceiptGenerator.generateReceiptForClient(orders[this.currentOrderPosition]);
        if(orders[this.currentOrderPosition].assignmentUrl) {
            inlineMarkup.push([{text: 'Показать прикрепленный файл', callback_data: 'Показать прикрепленный файл'}])
        }
        if(editCurrentMessage) {
            await bot.editMessageText(receipt, {
                chat_id: stateContext.getChatId(),
                message_id: stateContext.getLastMessageId() as number,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: inlineMarkup
                }
            })
        } else {
            await stateContext.sendMessage(receipt, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: inlineMarkup
                }
            })
        }
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
                const response = await axios.get(url, {responseType: 'arraybuffer'});
                const document = Buffer.from(response.data, 'binary')
                await bot.sendDocument(stateContext.getChatId(), document, {}, {
                    filename: 'Заказ#' + orders[this.currentOrderPosition].orderId,
                });
                await bot.answerCallbackQuery(callback.id);
            }
        }
        return super.callbackController(callback);
    }
}