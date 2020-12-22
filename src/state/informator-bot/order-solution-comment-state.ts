import {InformatorOrderState, OrdersState, OrderUploadSolutionState} from "./internal";
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";
import Status from "../../database/models/Status";
import {STATUS_FINISHED} from "../../constants";

const keyboardMarkup: Array<Array<KeyboardButton>> = [[{text: 'Вернуться в меню'}, {text: 'Назад'}],
    [{text: 'Вернуться к списку заказов'}]];

export default class OrderSolutionCommentState extends InformatorOrderState {

    async onBackMessage(): Promise<any> {
        await this.resetSolution();
        return this.stateContext.setState(new OrderUploadSolutionState(this.stateContext, this.order))
    }

    private async resetSolution() {
        this.order.solutionUrl = null;
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
        this.order.solutionComment = message.text;
        const status = await Status.findOne({ where: {name: STATUS_FINISHED }});
        if(!status) {
            const stateContext = this.stateContext;
            await stateContext.sendMessage('Ошибка сервера, пожалуйста, повторите позже');
            return stateContext.setState(new OrdersState(stateContext));
        }
        await this.order.save();
        await this.order.$set('status', status);
        await stateContext.sendMessage('Выполненное задание успешно загружено!');
        return stateContext.setState(new OrdersState(stateContext));
    }


}