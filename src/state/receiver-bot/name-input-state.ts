import {ReceiverBaseState, ChooseSubjectState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";

class NameInputState extends ReceiverBaseState {
    async initState() {
        await this.stateContext.sendMessage('Как вас зовут?');
    }

    async messageController (message: Message) {
        if(!message.text) {
            await this.sendMessage('Некорректно введено имя, пожалуйста, повторите попытку.');
            return;
        }
        const stateContext = this.stateContext;
        const order = stateContext.getOrder();
        order.clientName = message.text;
        order.username = message.chat.username || 'Юзернейм не указан';
        order.chatId = message.chat.id;
        await stateContext.setState(new ChooseSubjectState(stateContext));
    }


    async init() {
        await this.stateContext.sendMessage('Заполните заявку.');
    }
}

export default NameInputState;