import {ReceiverBaseState, EmailInputState} from "./internal";
import {Message} from "node-telegram-bot-api";

class PhoneInputState extends ReceiverBaseState {
    async initState() {
        await this.stateContext.sendMessage('Введите Ваш номер телефона, например +77071231212 или 87071231212:');
    }

    async messageController(message: Message) {
        const stateContext = this.stateContext;
        const isPlusSevenFormat = message.text?.trim().slice(0, 2) === '+7' && message.text?.replace(/\D/g, '').length === 11;
        const isEightFormat = message.text?.trim().slice(0, 1) === '8' && message.text?.replace(/\D/g, '').length === 11;
        if(!message.text || !isPlusSevenFormat && !isEightFormat) {
            await stateContext.sendMessage('Некорректный номер телефона, *номер должен начинаться на +7 или 8*, например +77071231212 или 87071231212. Пожалуйста, повторите попытку.');
            return;
        }
        const botContext = this.stateContext.getBotContext();
        const order = stateContext.getOrder();
        order.phone = message.text as string;
        await stateContext.setState(new EmailInputState(stateContext));
    }
}

export default PhoneInputState;