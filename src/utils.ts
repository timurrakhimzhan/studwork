import {InlineKeyboardButton} from "node-telegram-bot-api";

export const generateSubjectsMessage = (subjects: Array<ISubject>) => {
    return `Список доступных предметов:\n${subjects.map(subject => '• ' + subject.name).join('\n')}`;
}

export const generatePriceList = (subjects: Array<ISubject>) => {
    return `Прайс-лист:\n${subjects.map(subject => subject.name + ': ' + subject.price).join('\n')}`
}

export const generateInlineMenu = (subjects: Array<ISubject>): Array<Array<InlineKeyboardButton>> =>{
    const markup: Array<Array<InlineKeyboardButton>> = [];
    const buttons: Array<InlineKeyboardButton> = subjects.map(subject => ({text: subject.name, callback_data: subject.name}));
    while(buttons.length) {
        markup.push(buttons.splice(0, 2));
    }
    return markup;
}
