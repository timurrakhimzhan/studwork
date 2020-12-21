import {InlineKeyboardButton, KeyboardButton} from "node-telegram-bot-api";
import Subject from "../database/models/Subject";

export const generateSubjectsMessage = (subjects: Array<Subject>) => {
    return `Список доступных предметов:\n${subjects.map(subject => '• ' + subject.name).join('\n')}`;
}

export const generatePriceList = (subject: Subject) => {
    return `Прайс-лист (сумма может оказаться выше, взависимости от трудоемкости и сложности заданий):\n${subject.workTypes.map(workType => 
        `${workType.name}:`).join('\n')}`
}

export const generateInlineMenu = (menuItems: Array<{name: string; callback?: string | null; url?: string | null}>): Array<Array<InlineKeyboardButton>> =>{
    const markup: Array<Array<InlineKeyboardButton>> = [];

    const buttons: Array<InlineKeyboardButton> = menuItems.map(menuItem => {
        if(menuItem.url) {
            return {text: menuItem.name, url: menuItem.url};
        }
        if(menuItem.callback) {
            return {text: menuItem.name, callback_data: menuItem.callback};
        }
        return ({text: menuItem.name, callback_data: menuItem.name});
    });
    while(buttons.length) {
        markup.push(buttons.splice(0, 2));
    }
    return markup;
}

export const generateKeyboardMenu = (menuItems: Array<{name: string}>): Array<Array<KeyboardButton>> => {
    const markup: Array<Array<KeyboardButton>> = [];
    const buttons: Array<KeyboardButton> = menuItems.map(menuItem => ({text: menuItem.name}));
    while(buttons.length) {
        markup.push(buttons.splice(0, 2));
    }
    return markup;
}