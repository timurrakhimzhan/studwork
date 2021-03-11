import {AbstractItemsState} from "./internal";
import Status, {statusMeaningMap, StatusName} from "../../database/models/Status";
import Order from "../../database/models/Order";
import {CallbackQuery, InlineKeyboardButton, Message} from "node-telegram-bot-api";
import {CALLBACK_CLIENT_FILE, CALLBACK_TEACHER_FILE, STATUS_FINISHED} from "../../constants";
import {generateReceipt, getBufferFromUrl} from "../../utils/message-utils";
import AbstractStateContext from "../abstract-state-context";

export default abstract class AbstractOrdersState extends AbstractItemsState<Status, StatusName, Order> {
    private readonly initMessage: string | null;
    private notification: boolean;

    async initMaps(): Promise<any> {
        const statusCounts = await this.fetchStatusCounts();
        statusCounts.forEach((statusCount) => {
            this.categoryCountMap[statusCount.get('name')] = parseInt(statusCount.get('ordersCount') as string)
        });
        console.log(this.categoryCountMap);
    }

    async initState(): Promise<any> {
        await this.initMaps();
        if(this.notification) {
            this.notification = false;
            return this.stateContext.sendMessage(this.initMessage || 'Выберите статус заказа:');
        }
        return this.stateContext.sendMessage('Выберите статус заказа:');

    }

    protected constructor(stateContext: AbstractStateContext, initMessage?: string) {
        const statuses = stateContext.getBotContext().getStatuses().map((status) => status.name);
        super(stateContext, statuses, statusMeaningMap);
        this.initMessage = initMessage || null;
        this.notification = !!initMessage;
    }

    protected generateExtraInlineMarkup(order: Order): Array<Array<InlineKeyboardButton>> {
        const inlineMarkup: Array<Array<InlineKeyboardButton>> = [];
        if(order.assignmentFile) {
            inlineMarkup.push([{text: 'Показать прикрепленный файл', callback_data: CALLBACK_CLIENT_FILE}])
        }
        if(order.status.name === STATUS_FINISHED) {
            inlineMarkup.push([{text: 'Показать выполненное задание', callback_data: CALLBACK_TEACHER_FILE}])
        }
        return inlineMarkup;
    }

    protected generateItemMessage(item: Order): string {
        return generateReceipt(item);
    }

    abstract getAssignmentDocument(order: Order): Promise<string | Buffer>;
    abstract getSolutionDocument(order: Order): Promise<string | Buffer>;
    abstract setAssignmentFileId(order: Order, fileId: string): Promise<any>;
    abstract setSolutionFileId(order: Order, fileId: string): Promise<any>;


    async callbackController(callback: CallbackQuery): Promise<any> {
        if(!this.currentCategory) {
            return;
        }
        const stateContext = this.stateContext;
        const bot = stateContext.getBotContext().getBot();
        const orders = this.categoryItemsMap[this.currentCategory] as Array<Order>;
        const order = orders[this.currentItemPosition];
        const callbackData = callback.data as string;

        if(callbackData === CALLBACK_CLIENT_FILE) {
            try {
                await bot.answerCallbackQuery(callback.id, {text: 'Если файл много весит, это может занять какое-то время.', show_alert: true});
                const document = await this.getAssignmentDocument(order);
                const message = await bot.sendDocument(stateContext.getChatId(), document, {}, {
                    filename: 'Прикрепленный файл к заказу #' + orders[this.currentItemPosition].orderId,
                });
                if(message.photo) {
                    await this.setAssignmentFileId(order, message.photo[message.photo.length - 1].file_id)
                } else if(message.document) {
                    await this.setAssignmentFileId(order, message.document.file_id)
                }
            } catch(e) {
                console.log(e);
                await stateContext.sendMessage('Извините, не удалось загрузить прикрепленный файл.')
            } finally {}
        }
        if(callbackData === CALLBACK_TEACHER_FILE) {
            try {
                await bot.answerCallbackQuery(callback.id, {text: 'Если файл много весит, это может занять какое-то время.', show_alert: true});
                const document = await this.getSolutionDocument(order)
                const message = await bot.sendDocument(stateContext.getChatId(), document, {}, {
                    filename: 'Выполненное задание к заказу #' + order.orderId,
                });
                if(message.photo) {
                    await this.setSolutionFileId(order, message.photo[message.photo.length - 1].file_id)
                } else if(message.document) {
                    await this.setSolutionFileId(order, message.document.file_id)
                }
            } catch(e) {
                await stateContext.sendMessage('Извините, не удалось загрузить прикрепленный файл.')
            } finally {
                await bot.answerCallbackQuery(callback.id);
            }
        }
        return super.callbackController(callback);
    }

    async messageController(message: Message): Promise<any> {
        return super.messageController(message);
    }

    protected abstract fetchStatusCounts(): Promise<Array<Status>>;

}