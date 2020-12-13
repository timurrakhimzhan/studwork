import TelegramBot, {CallbackQuery, Message} from "node-telegram-bot-api";
import {generateInlineKeyboard} from "./utils";
import {DATE_INPUT_BACK, DATE_INPUT_DAY, DATE_INPUT_MONTH, DATE_INPUT_NEXT, DATE_INPUT_WEEKDAY} from "./constants";

class CalendarInfo {
    private bot: TelegramBot;
    private year: number = new Date().getFullYear();
    private month: number = new Date().getMonth() + 1;
    private day: number = new Date().getDate();

    private readonly onDayChosen: (year: number, month: number, day: number) => Promise<void> = async () => {};

    constructor(bot: TelegramBot, onDayChosen: (year: number, month: number, day: number) => Promise<void>) {
        this.bot = bot;
        this.onDayChosen = onDayChosen;
    }

    public sendCalendar (chatId: number, label: string = 'Выберите дату:') {
        return this.bot.sendMessage(chatId, label, {reply_markup: {inline_keyboard: generateInlineKeyboard(this.month, this.year)}})
    }

    public async callbackController(callback: CallbackQuery) {
        const callbackData = callback.data;
        if (callbackData === DATE_INPUT_WEEKDAY || callback.data === DATE_INPUT_MONTH) {
            await this.bot.answerCallbackQuery(callback.id);
        }
        if(callbackData === DATE_INPUT_BACK) {
            await this.chooseBackMonth(callback);
        }
        if(callbackData === DATE_INPUT_NEXT) {
            await this.chooseNextMonth(callback);
        }
        if(callbackData?.includes(DATE_INPUT_DAY)) {
            await this.chooseDay(callback);
        }
    }

    private chooseNextMonth = async (callback: CallbackQuery) => {
        const message = callback.message as Message;
        if(this.month === 12) {
            this.year++;
            this.month = 1;
        } else {
            this.month++;
        }
        await this.bot.answerCallbackQuery(callback.id);
        await this.bot.editMessageReplyMarkup({
            inline_keyboard: generateInlineKeyboard(this.month, this.year)
        }, {chat_id: message.chat.id, message_id: message.message_id})
    }

    private chooseBackMonth = async (callback: CallbackQuery) => {
        const message = callback.message as Message;
        if(this.month === 1) {
            this.year--;
            this.month = 12;
        } else {
            this.month--;
        }
        await this.bot.answerCallbackQuery(callback.id);
        await this.bot.editMessageReplyMarkup({
            inline_keyboard: generateInlineKeyboard(this.month, this.year)
        }, {chat_id: message.chat.id, message_id: message.message_id})
    }

    private chooseDay = async (callback: CallbackQuery) => {
        const callbackData = callback.data as string;
        const message = callback.message as Message;
        const dayString: string = callbackData?.split('/')[2] || '';
        let day = parseInt(dayString);
        if(isNaN(day)) {
            await this.bot.answerCallbackQuery(callback.id);
        } else {
            this.day = day;
            const formatter =  Intl.DateTimeFormat(['ru-RU'], {day: 'numeric', month: 'long', year: 'numeric'});
            const chosenDate = new Date(`${this.year}-${this.month}-${this.day}`);
            await this.bot.answerCallbackQuery(callback.id);
            await this.bot.editMessageText(`Выбранная дата: *${formatter.format(chosenDate)}*`, {
                chat_id: message.chat.id,
                message_id: message.message_id,
                reply_markup: {inline_keyboard: []},
                parse_mode: 'Markdown',
            });
            await this.onDayChosen(this.year, this.month, this.day);
        }
    }
}

export default CalendarInfo;