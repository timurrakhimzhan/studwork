// import TelegramBot, {CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup} from "node-telegram-bot-api";
// import CalendarInfo from "./CalendarInfo";
//
// const DATE_INPUT_BACK = 'DATE_INPUT/BACK';
// const DATE_INPUT_NEXT = 'DATE_INPUT/NEXT';
//
// const DATE_INPUT_MONTH = 'DATE_INPUT/MONTH';
// const DATE_INPUT_WEEKDAY = 'DATE_INPUT/WEEKDAY';
// const DATE_INPUT_DAY = 'DATE_INPUT/DAY';
//
// const monthsLocale: Array<string> = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
// const daysLocale: Array<string> = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
//
// const calendar = new CalendarInfo();
//
// const generateInlineKeyboard = (month: number, year: number): Array<Array<InlineKeyboardButton>> => {
//     const inlineKeyboard: Array<Array<InlineKeyboardButton>> = [
//         [
//             {text: '<', callback_data: DATE_INPUT_BACK},
//             {text: monthsLocale[month - 1], callback_data: DATE_INPUT_MONTH},
//             {text: '>', callback_data: DATE_INPUT_NEXT}
//         ],
//         daysLocale.map((day) => ({text: day, callback_data: DATE_INPUT_WEEKDAY})),
//     ];
//     let day = 1;
//     while(true) {
//         const keyboardRow: Array<InlineKeyboardButton> = [];
//         let finished = false;
//         for(let weekDay = 0; weekDay < 7; weekDay++) {
//             const date =  new Date(`${year}-${month}-${day}`);
//             if(isNaN(date.getDate())) {
//                 finished = true;
//                 keyboardRow.push({text: ' ', callback_data: DATE_INPUT_DAY});
//                 continue;
//             }
//             if(date.getDay() !== weekDay) {
//                 keyboardRow.push({text: ' ', callback_data: DATE_INPUT_DAY});
//             } else {
//                 keyboardRow.push({text: date.getDate().toString(), callback_data: `${DATE_INPUT_DAY}/${date.getDate()}`});
//                 day++;
//             }
//         }
//         const isRowEmpty = keyboardRow.reduce((accum, row) => accum && row.text.trim().length === 0, true);
//         if(!isRowEmpty) {
//             inlineKeyboard.push(keyboardRow);
//         }
//         if(finished) {
//             break;
//         }
//     }
//     return inlineKeyboard;
// }
//
// export const botSendCalendar = (bot: TelegramBot, chatId: number, label: string = 'Выберите дату:') => {
//     return bot.sendMessage(chatId, label, {reply_markup: {inline_keyboard: generateInlineKeyboard(calendar.getMonth(), calendar.getYear() )}})
// }
//
// export const calendarCallbackListener = async (bot: TelegramBot, callback: CallbackQuery) => {
//     if(!callback.message) {
//         return;
//     }
//     const callbackData = callback.data;
//     if (callbackData === DATE_INPUT_WEEKDAY || callback.data === DATE_INPUT_MONTH) {
//         await bot.answerCallbackQuery(callback.id);
//     }
//     if(callbackData === DATE_INPUT_BACK) {
//         if(calendar.getMonth() === 1) {
//             calendar.setYear(calendar.getYear() - 1);
//             calendar.setMonth(12);
//         } else {
//             calendar.setMonth(calendar.getMonth() - 1);
//         }
//         await bot.answerCallbackQuery(callback.id);
//         await bot.editMessageReplyMarkup({
//             inline_keyboard: generateInlineKeyboard(calendar.getMonth(), calendar.getYear())
//         }, {chat_id: callback.message.chat.id, message_id: callback.message.message_id})
//     }
//     if(callbackData === DATE_INPUT_NEXT) {
//         if(calendar.getMonth() === 12) {
//             calendar.setYear(calendar.getYear() + 1);
//             calendar.setMonth(1);
//         } else {
//             calendar.setMonth(calendar.getMonth() + 1);
//         }
//         await bot.answerCallbackQuery(callback.id);
//         await bot.editMessageReplyMarkup({
//             inline_keyboard: generateInlineKeyboard(calendar.getMonth(), calendar.getYear())
//         }, {chat_id: callback.message.chat.id, message_id: callback.message.message_id})
//     }
//     if(callbackData?.includes(DATE_INPUT_DAY)) {
//         const dayString: string = callbackData?.split('/')[2] || '';
//         let day = parseInt(dayString);
//         if(isNaN(day)) {
//             await bot.answerCallbackQuery(callback.id);
//         } else {
//             calendar.setDay(day);
//             const formatter = Intl.DateTimeFormat(['ru-RU'], {day: 'numeric', month: 'long', year: 'numeric'});
//             const chosenDate = new Date(`${calendar.getYear()}-${calendar.getMonth()}-${calendar.getDay()}`);
//             await bot.answerCallbackQuery(callback.id);
//             await bot.editMessageText(`Выбранная дата: *${formatter.format(chosenDate)}*`, {
//                 chat_id: callback.message.chat.id,
//                 message_id: callback.message.message_id,
//                 reply_markup: {inline_keyboard: []},
//                 parse_mode: 'Markdown',
//             });
//         }
//     }
// }
//
// export default calendar;

export { default } from './CalendarInfo';