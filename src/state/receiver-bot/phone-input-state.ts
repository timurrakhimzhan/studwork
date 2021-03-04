import {AbstractReceiverBaseState, EmailInputState, AbstractReceiverOrderState, TimeInputState} from "./internal";
import {Message} from "node-telegram-bot-api";

class PhoneInputState extends AbstractReceiverOrderState {
    async initState() {
        await this.stateContext.sendMessage('Введите Ваш номер телефона, в формате (“+7” или “8”):');
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new TimeInputState(this.stateContext, this.order));
    }

    async messageController(message: Message) {
        const stateContext = this.stateContext;
        const isPlusSevenFormat = message.text?.trim().slice(0, 2) === '+7' && message.text?.replace(/\D/g, '').length === 11;
        const isEightFormat = message.text?.trim().slice(0, 1) === '8' && message.text?.replace(/\D/g, '').length === 11;
        if(!message.text || !isPlusSevenFormat && !isEightFormat) {
            await stateContext.sendMessage('Некорректный номер телефона, *номер должен начинаться в формате ("+7" или "8")*');
            return;
        }
        this.order.phone = message.text as string;
        await stateContext.setState(new EmailInputState(stateContext, this.order));
    }
}

export default PhoneInputState;