import TelegramBot, {CallbackQuery, Message} from "node-telegram-bot-api";
import {receiverSendMessage} from "../telegram-bot-controllers";
import {generatePriceList, generateSubjectsMessage} from "../../utils";
import App from "../../App";
import {CONTACTS, FEEDBACK_COMMENT, FEEDBACK_EVALUATE, MAIN_MENU, NAME_INPUT} from "../../states";

export const mainMenuMessageController = async (bot: TelegramBot, message: Message) => {
    const app = App.getInstance();
    if(message.text?.trim() === 'Предметы') {
        await receiverSendMessage(message.chat.id, generateSubjectsMessage(App.getInstance().getSubjects()));
        return;
    }
    if(message.text?.trim() === 'Прайс-лист') {
        await receiverSendMessage(message.chat.id, generatePriceList(App.getInstance().getSubjects()));
        return;
    }
    if(message.text?.trim() === 'Заказать работу') {
        app.setChatState(message.chat.id, NAME_INPUT);
        await receiverSendMessage(message.chat.id, 'Заполните заявку.')
        await receiverSendMessage(message.chat.id, 'Как вас зовут?')
        return;
    }
    if(message.text?.trim() === 'Поддержка') {
        app.setChatState(message.chat.id, CONTACTS);
        await receiverSendMessage(message.chat.id, 'Контакты: ');
        app.setChatState(message.chat.id, MAIN_MENU);
        return;
    }
    if(message.text?.trim() === 'Оценить работу бота') {
        if(app.hasFeedbackGiven(message.chat.id)) {
            await receiverSendMessage(message.chat.id, 'Вы уже оценили работу бота. Можете присоединиться к нам в общий чат: @StudWorkChat')
        } else {
            app.setChatState(message.chat.id, FEEDBACK_EVALUATE);
            await receiverSendMessage(message.chat.id, 'Оцените работу бота:');
            app.setChatState(message.chat.id, MAIN_MENU);
        }
        return;
    }

    await receiverSendMessage(message.chat.id, 'Выберите интересующую вас тему:');
}

export const mainMenuCallbackController = async (bot: TelegramBot, callback: CallbackQuery) => {
    if(!callback.data || !callback.message) {
        return;
    }
    const app = App.getInstance();
    const callbackData = callback.data;
    if(callbackData === 'Отлично' || callbackData === 'Плохо' || callbackData === 'Удовлетворительно') {
        const feedback = app.getFeedBack(callback.message.chat.id);
        app.setChatState(callback.message.chat.id, FEEDBACK_COMMENT);
        feedback.setEvaluation(callbackData);
        feedback.setUsername(callback.message.chat.username || 'Юзернейм не указан');
        await bot.answerCallbackQuery(callback.id, {text: `Вы выбрали: ${callbackData}`, show_alert: true});
        await receiverSendMessage(callback.message.chat.id, 'Оставьте свой комментарий:');
        return;
    }
    if(callbackData === 'Позвонить') {
        await bot.sendContact(callback.message.chat.id, '+77756969887', 'Адам');
        await bot.answerCallbackQuery(callback.id);
        return;
    }

}