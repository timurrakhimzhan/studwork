import {ReceiverBaseState, PhoneInputState} from "./internal";
import {Message} from "node-telegram-bot-api";
import moment from 'moment';

class TimeInputState extends ReceiverBaseState {
    async initState(): Promise<any> {
        await this.stateContext.sendMessage('Введите время сдачи работы, например 14:30')
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const time = moment(message.text || '', 'HH:mm');
        if(!time.isValid() || !message.text?.includes(':')) {
            return this.stateContext.sendMessage('Неверный формат времени. *Пример корректного формата: 14:30*');
        }
        const order = botContext.getOrderInfo(stateContext.getChatId());
        order.datetime.setHours(time.hours());
        order.datetime.setMinutes(time.minutes());
        await stateContext.setState(new PhoneInputState(stateContext));
    }
}

export default TimeInputState;