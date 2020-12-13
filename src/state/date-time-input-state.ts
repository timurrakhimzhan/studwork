import {BaseState, PhoneInputState} from "./internal";
import {Message} from "node-telegram-bot-api";
import moment from "moment";

class DateTimeInputState extends BaseState{

    async initState () {
        await this.context.sendMessage('Когда вам сдать работу? *Пример корректного формата: 15.12.2020 15:30*');
    }

     async messageController (message: Message) {
        const stateContext = this.context;
        const momentDate = moment(message.text || '', 'DD.MM.YYYY HH:mm:ss')
        if(!momentDate.isValid()) {
            await stateContext.sendMessage('Некорректный формат даты.\n*Пример корректного формата: 15.12.2020 15:30*. Пожалуйста, повторите попытку.');
            return;
        }
        const app = stateContext.getApp();
        app.getOrderInfo(stateContext.getChatId()).setDate(momentDate.format('DD.MM.YYYY HH:mm:ss'));
        await stateContext.setState(new PhoneInputState(stateContext));
    }
}

export default DateTimeInputState;