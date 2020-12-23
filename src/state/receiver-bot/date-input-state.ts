import {AbstractReceiverOrderState, TimeInputState, CommentInputState} from "./internal";
import {CallbackQuery, Message, SendMessageOptions} from "node-telegram-bot-api";
import CalendarInfo from "../../calendar";

class DateInputState extends AbstractReceiverOrderState {
    private onDayChosen = async (year: number, month: number, day: number) => {
        const stateContext = this.stateContext;
        const date = new Date();
        date.setFullYear(year)
        date.setMonth(month - 1);
        date.setDate(day);
        this.order.datetime = date;
        await stateContext.setState(new TimeInputState(stateContext, this.order));
    }
    private calendarInfo = new CalendarInfo(this.stateContext.getBotContext().getBot(), this.onDayChosen);

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new CommentInputState(this.stateContext, this.order))
    }

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return this.calendarInfo.sendCalendar(this.stateContext.getChatId(), message);
    }

    async initState(): Promise<any> {
        return this.stateContext.sendMessage('Выберите дату сдачи:')
    }

    async callbackController(callback: CallbackQuery): Promise<any> {
        await this.calendarInfo.callbackController(callback);
    }
}

export default DateInputState;