import {BaseState, EmailInputState} from "./internal";
import {Message} from "node-telegram-bot-api";
import App from "../App";

class PhoneInputState extends BaseState {
    async initState() {
        await this.context.sendMessage('Введите Ваш номер телефона:');
    }

    async messageController(message: Message) {
        const stateContext = this.context;
        const isPlusSevenFormat = message.text?.trim().slice(0, 2) === '+7' && message.text?.replace(/\D/g, '').length === 11;
        const isEightFormat = message.text?.trim().slice(0, 1) === '8' && message.text?.replace(/\D/g, '').length === 11;
        if(!message.text || !isPlusSevenFormat && !isEightFormat) {
            await stateContext.sendMessage('Некорректный номер телефона, *номер должен начинаться на +7*, пожалуйста, повторите попытку.');
            return;
        }
        const app = this.context.getApp();
        app.getOrderInfo(stateContext.getChatId()).setPhone(message.text as string);
        await stateContext.setState(new EmailInputState(stateContext));
    }
}

export default PhoneInputState;