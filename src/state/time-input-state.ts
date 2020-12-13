import {BaseState, PhoneInputState} from "./internal";
import {Message} from "node-telegram-bot-api";
import moment from 'moment';

class TimeInputState extends BaseState {
    async initState(): Promise<any> {
        await this.context.sendMessage('Введите время сдачи работы, например 14:30')
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.context;
        const app = stateContext.getApp();
        const time = moment(message.text || '', 'HH:mm');
        if(!time.isValid() || !message.text?.includes(':')) {
            return this.context.sendMessage('Неверный формат времени. Пример корректного формата: 14:30');
        }
        app.getOrderInfo(stateContext.getChatId()).setTime(time.format('HH:mm'));
        await stateContext.setState(new PhoneInputState(stateContext));
    }
}

export default TimeInputState;