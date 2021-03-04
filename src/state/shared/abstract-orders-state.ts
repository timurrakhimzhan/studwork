import {AbstractItemsState} from "./internal";
import Status, {statusMeaningMap, StatusName} from "../../database/models/Status";
import Order from "../../database/models/Order";
import {CallbackQuery, InlineKeyboardButton} from "node-telegram-bot-api";
import {CALLBACK_CLIENT_FILE, CALLBACK_TEACHER_FILE, STATUS_FINISHED} from "../../constants";
import {generateReceipt, getBufferFromUrl} from "../../utils/message-utils";
import AbstractStateContext from "../abstract-state-context";

export default abstract class AbstractOrdersState extends AbstractItemsState<Status, StatusName, Order> {
    private readonly initMessage: string | null;
    private notification: boolean;
    async initState(): Promise<any> {
        const statusCounts = await this.fetchStatusCounts();
        statusCounts.forEach((statusCount) => {
            this.categoryCountMap[statusCount.get('name')] = parseInt(statusCount.get('ordersCount') as string)
        })
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
        if(order.assignmentUrls) {
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
            const url = order.assignmentUrls;
            try {
                const document = await getBufferFromUrl(url || '');
                await bot.sendDocument(stateContext.getChatId(), document, {}, {
                    filename: 'Прикрепленный файл к заказу #' + orders[this.currentItemPosition].orderId,
                });
            } catch(e) {
                await stateContext.sendMessage('Извините, не удалось загрузить прикрепленный файл.')
            } finally {
                await bot.answerCallbackQuery(callback.id);
            }
        }
        if(callbackData === CALLBACK_TEACHER_FILE) {
            const url = order.solutionUrl;
            try {
                const document = await getBufferFromUrl(url || '');
                await bot.sendDocument(stateContext.getChatId(), document, {}, {
                    filename: 'Выполненное задание к заказу #' + order.orderId,
                });
            } catch(e) {
                await stateContext.sendMessage('Извините, не удалось загрузить прикрепленный файл.')
            } finally {
                await bot.answerCallbackQuery(callback.id);
            }
        }
        return super.callbackController(callback);
    }

    protected abstract fetchStatusCounts(): Promise<Array<Status>>;

}