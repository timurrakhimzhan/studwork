import Status, {statuses, statusMeaningMap, StatusName} from "../../database/models/Status";
import Order from "../../database/models/Order";
import {CallbackQuery, Message, SendMessageOptions} from "node-telegram-bot-api";
import {generateKeyboardMenu} from "../../utils/tg-utils";
import {AbstractBaseState} from "../internal";

export default abstract class AbstractOrdersState extends AbstractBaseState {
    protected statusOrders: {[T in StatusName]?: Array<Order>} = {}
    protected statusCount: {[T in StatusName]?: number} = {};
    protected currentStatus: StatusName | null = null;
    protected currentOrderPosition = 0;
    protected offset = 0;

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        const keyboardMenu = generateKeyboardMenu(statuses.map((status: StatusName) => ({
            name: `${statusMeaningMap[status]} (${this.statusCount[status]})`
        })));
        keyboardMenu.push([{text: 'Вернуться в меню'}])
        return super.sendMessage(message, options || {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: keyboardMenu,
                resize_keyboard: true,
            },
        });
    }

    async initState(): Promise<any> {
        const statusCounts = await this.getStatusCounts();
        statusCounts.forEach((statusCount) => {
            this.statusCount[statusCount.get('name')] = parseInt(statusCount.get('ordersCount') as string)
        })
        await this.stateContext.sendMessage('Выберите статус заказа:');
    }

    protected abstract getStatusCounts(): Promise<Array<Status>>;
    protected abstract getOrders(): Promise<Array<Order>>;

    protected async fetchReceipts(status: StatusName) {
        if(!this.statusOrders[status]) {
            this.statusOrders[status] = await this.getOrders();
        }
        if(this.statusOrders[status]?.length === this.statusCount[status]) {
            return;
        }
        if(this.statusOrders[status]?.length === this.currentOrderPosition) {
            this.offset += 10;
            const nextOrders = await this.getOrders();
            this.statusOrders[status] = this.statusOrders[status]?.concat(nextOrders);
        }
    }

    protected abstract showReceipt(editCurrentMessage?: boolean): Promise<void>;

    async messageController(message: Message): Promise<any> {
        const statusChosen = statuses.find((status) => message.text?.includes(statusMeaningMap[status]));
        if(statusChosen) {
            this.currentStatus = statusChosen;
            await this.showReceipt();
        }
    }


    async callbackController(callback: CallbackQuery): Promise<any> {
        if(!this.currentStatus) {
            return;
        }
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const bot = botContext.getBot();
        const callbackData = callback.data as string;
        if(callbackData === 'Назад') {
            if(this.currentOrderPosition > 0) {
                this.currentOrderPosition--;
            }
            await this.showReceipt(true);
            await bot.answerCallbackQuery(callback.id);
        }
        if(callbackData === 'Вперед') {
            if(this.currentOrderPosition + 1 !== this.statusCount[this.currentStatus]) {
                this.currentOrderPosition++;
            }
            await this.showReceipt(true);
            await bot.answerCallbackQuery(callback.id);
        }
    }
}