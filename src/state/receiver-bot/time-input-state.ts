import {DateInputState, PhoneInputState, ReceiverOrderState} from "./internal";
import {Message} from "node-telegram-bot-api";
import moment from 'moment';

class TimeInputState extends ReceiverOrderState {
    async initState(): Promise<any> {
        await this.stateContext.sendMessage('Введите время сдачи работы, например 14:30')
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new DateInputState(this.stateContext, this.order));
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        const time = moment(message.text || '', 'HH:mm');
        if(!time.isValid() || !message.text?.includes(':')) {
            return this.stateContext.sendMessage('Неверный формат времени. *Пример корректного формата: 14:30*');
        }
        this.order.datetime.setHours(time.hours());
        this.order.datetime.setMinutes(time.minutes());
        await stateContext.setState(new PhoneInputState(stateContext, this.order));
    }
}

export default TimeInputState;