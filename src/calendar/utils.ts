import {InlineKeyboardButton} from "node-telegram-bot-api";
import {DATE_INPUT_BACK, DATE_INPUT_DAY, DATE_INPUT_MONTH, DATE_INPUT_NEXT, DATE_INPUT_WEEKDAY} from "./constants";

const monthsLocale: Array<string> = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const daysLocale: Array<string> = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const generateInlineKeyboard = (month: number, year: number): Array<Array<InlineKeyboardButton>> => {
    const inlineKeyboard: Array<Array<InlineKeyboardButton>> = [
        [
            {text: '<', callback_data: DATE_INPUT_BACK},
            {text: monthsLocale[month - 1], callback_data: DATE_INPUT_MONTH},
            {text: '>', callback_data: DATE_INPUT_NEXT}
        ],
        daysLocale.map((day) => ({text: day, callback_data: DATE_INPUT_WEEKDAY})),
    ];
    let day = 1;
    while(true) {
        const keyboardRow: Array<InlineKeyboardButton> = [];
        let finished = false;
        for(let weekDay = 0; weekDay < 7; weekDay++) {
            const date =  new Date(`${year}-${month}-${day}`);
            if(isNaN(date.getDate())) {
                finished = true;
                keyboardRow.push({text: ' ', callback_data: DATE_INPUT_DAY});
                continue;
            }
            if(date.getDay() !== weekDay) {
                keyboardRow.push({text: ' ', callback_data: DATE_INPUT_DAY});
            } else {
                keyboardRow.push({text: date.getDate().toString(), callback_data: `${DATE_INPUT_DAY}/${date.getDate()}`});
                day++;
            }
        }
        const isRowEmpty = keyboardRow.reduce((accum, row) => accum && row.text.trim().length === 0, true);
        if(!isRowEmpty) {
            inlineKeyboard.push(keyboardRow);
        }
        if(finished) {
            break;
        }
    }
    return inlineKeyboard;
}