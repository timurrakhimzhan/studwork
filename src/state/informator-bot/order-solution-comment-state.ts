import {AbstractInformatorOrderState, OrdersState, OrderUploadSolutionState} from "./internal";
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";
import Status from "../../database/models/Status";
import {STATUS_FINISHED, STATUS_NOT_PAYED} from "../../constants";

const keyboardMarkup: Array<Array<KeyboardButton>> = [[{text: 'Вернуться в меню'}, {text: 'Назад'}],
    [{text: 'Вернуться к списку заказов'}]];

export default class OrderSolutionCommentState extends AbstractInformatorOrderState {

    async onBackMessage(): Promise<any> {
        await this.resetSolution();
        return this.stateContext.setState(new OrderUploadSolutionState(this.stateContext, this.order))
    }

    private async resetSolution() {
        this.order.solutionFile = null;
        this.order.solutionComment = null;
    }

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options || {
            reply_markup: {
                keyboard: keyboardMarkup,
                resize_keyboard: true,
            },
        })
    }

    async initState(): Promise<any> {
        return this.stateContext.sendMessage('Оставьте комментарий к вашей работе:');
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        if(message.text?.trim() === 'Вернуться к списку заказов') {
            return stateContext.setState(new OrdersState(stateContext));
        }
        if(!message.text?.trim().length) {
            return stateContext.sendMessage('Комментарий должен содержать символы');
        }
        if(!this.order.solutionFile) {
            await stateContext.sendMessage('Ошибка: не обнаружено решение. Пожалуйста, загрузите файл еще раз.');
            return this.onBackMessage();
        }
        this.order.solutionComment = message.text;
        const statuses = stateContext.getBotContext().getStatuses();
        const statusFound = statuses.find((status) => status.name === STATUS_FINISHED);
        if(!statusFound) {
            await stateContext.sendMessage('Ошибка сервера, пожалуйста, повторите позже');
            return stateContext.setState(new OrdersState(stateContext));
        }
        await this.order.save();
        await this.order.$set('status', statusFound);
        await this.order.solutionFile.save();
        await this.order.$set('solutionFile', this.order.solutionFile );
        await stateContext.sendMessage('Выполненное задание успешно загружено!');
        this.order.status = statusFound;
        await stateContext.notifyReceiverBot(this.order);
        await stateContext.setState(new OrdersState(stateContext));
    }


}