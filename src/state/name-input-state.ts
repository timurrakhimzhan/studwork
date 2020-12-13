import {BaseState, ChooseSubjectState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";

class NameInputState extends BaseState {
    async initState() {
        await this.context.sendMessage('Как вас зовут?');
    }

    async messageController (message: Message) {
        if(!message.text) {
            await this.sendMessage('Некорректно введено имя, пожалуйста, повторите попытку.');
            return;
        }
        const stateContext = this.context;
        const app = stateContext.getApp();
        const order = app.getOrderInfo(stateContext.getChatId());
        order.setName(message.text);
        order.setUserName(message.chat.username || 'Юзернейм не указан');
        await this.context.setState(new ChooseSubjectState(stateContext));
    }


    async init() {
        await this.context.sendMessage('Заполните заявку.');
    }
}

export default NameInputState;