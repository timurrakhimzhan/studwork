import {BaseState} from "./internal";
import {CallbackQuery, Message, SendMessageOptions} from "node-telegram-bot-api";
import CalendarInfo from "../calendar";
import moment from 'moment';
import {TimeInputState} from "./internal";

class DateInputState extends BaseState {
    private onDayChosen = async (year: number, month: number, day: number) => {
        const stateContext = this.context;
        const app = stateContext.getApp();
        const date = new Date();
        date.setFullYear(year)
        date.setMonth(month);
        date.setDate(day);
        app.getOrderInfo(stateContext.getChatId()).setDate(moment(date).format('DD.MM.YYYY'));
        await stateContext.setState(new TimeInputState(stateContext));
    }
    private calendarInfo = new CalendarInfo(this.context.getBot(), this.onDayChosen);

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return this.calendarInfo.sendCalendar(this.context.getChatId(), message);
    }

    async initState(): Promise<any> {
        return this.context.sendMessage('Выберите дату сдачи:')
    }

    async callbackController(callback: CallbackQuery): Promise<any> {
        await this.calendarInfo.callbackController(callback);
    }
}

export default DateInputState;