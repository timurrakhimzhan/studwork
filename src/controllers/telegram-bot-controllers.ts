import TelegramBot, {KeyboardButton, Message} from "node-telegram-bot-api";
import {generateInlineMenu} from "../utils";
import App from "../App";
import {
    CHOOSE_CONTACT_OPTION,
    CHOOSE_SUBJECT,
    CONTACTS,
    FEEDBACK_EVALUATE,
    MAIN_MENU,
} from "../states";

const mainMenu: Array<Array<KeyboardButton>> =  [
    [{text: 'Предметы'}, {text: 'Заказать работу'}],
    [{text: 'Прайс-лист'}, {text: 'Поддержка'}],
    [{text: 'Оценить работу бота'}]
];

const backMenu: Array<Array<KeyboardButton>> = [
    [{text: 'Вернуться в меню'}],
];

export async function receiverSendMessage(chatId: number, reply: string) {
    const bot = App.getInstance().getReceiverBot() as TelegramBot;
    const state = App.getInstance().getChatState(chatId);
    if(state === MAIN_MENU) {
        return bot.sendMessage(chatId, reply, {reply_markup: {keyboard: mainMenu, resize_keyboard: true}, parse_mode: 'Markdown',});
    } else if(state === CHOOSE_SUBJECT) {
        return bot.sendMessage(chatId, reply, {reply_markup: {
            inline_keyboard: generateInlineMenu(App.getInstance().getSubjects()),
        }, parse_mode: 'Markdown'});
    } else if(state === CHOOSE_CONTACT_OPTION) {
        return bot.sendMessage(chatId, reply, {reply_markup: {
                inline_keyboard: [[{text: 'Телефон', callback_data: 'Телефон'}, {text: 'Почта', callback_data: 'Почта'}]],
            }, parse_mode: 'Markdown'});
    } else if(state === CONTACTS) {
        return bot.sendMessage(chatId, reply, {reply_markup: {
            inline_keyboard: [[
                {text: 'Позвонить', callback_data: 'Позвонить'},
                {text: 'Whatsapp', url: 'https://wa.me/77756969887'}],
                [{text: 'Telegram', url: 'tg://resolve?domain=Adam0304'}]]
            }});
    } else if(state === FEEDBACK_EVALUATE) {
        return bot.sendMessage(chatId, reply, {reply_markup: {
            inline_keyboard: [[
                {text: 'Отлично', callback_data: 'Отлично'},
                {text: 'Плохо', callback_data: 'Плохо'}],
                [{text: 'Удовлетворительно', callback_data: 'Удовлетворительно'}]],
            }});
    } else {
        return bot.sendMessage(chatId, reply, {reply_markup: {keyboard: backMenu, resize_keyboard: true}, parse_mode: 'Markdown'});
    }
}

export async function informatorSendMessage(reply: string) {
    const bot = App.getInstance().getInformatorBot();
    const informatorChatIds = [317143449, 504600826];
    for(let chatId of informatorChatIds) {
        await bot.sendMessage(chatId, reply, {parse_mode: 'Markdown'});
    }
}

export async function informatorSendDocument(doc: Buffer) {
    const bot = App.getInstance().getInformatorBot();
    const informatorChatIds = [317143449, 504600826];
    for(let chatId of informatorChatIds) {
        await bot.sendDocument(chatId, doc);
    }
}