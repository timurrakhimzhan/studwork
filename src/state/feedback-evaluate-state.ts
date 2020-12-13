import {BaseState, MainMenuState, FeedbackCommentState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery, ReplyKeyboardMarkup} from "node-telegram-bot-api";

const feedbackEvaluateInlineMenu = [[
        {text: 'Отлично', callback_data: 'Отлично'},
        {text: 'Плохо', callback_data: 'Плохо'}],
        [{text: 'Удовлетворительно', callback_data: 'Удовлетворительно'}]];


class FeedbackEvaluateState extends BaseState {
    async initState() {
        const stateContext = this.context;
        await stateContext.sendMessage('Пожалуйста, оставьте оценку.');
        await stateContext.sendMessage('Оцените работу бота:', {reply_markup: {inline_keyboard: feedbackEvaluateInlineMenu, remove_keyboard: true}});
    }

    async callbackController (callback: CallbackQuery) {
        const message = callback.message as Message;
        const callbackData = callback.data as string;
        const stateContext = this.context;
        const app = stateContext.getApp();
        const bot = stateContext.getBot();
        if(callbackData === 'Отлично' || callbackData === 'Плохо' || callbackData === 'Удовлетворительно') {
            await bot.answerCallbackQuery(callback.id);
            const feedback = app.getFeedBack(stateContext.getChatId());
            feedback.setEvaluation(callbackData);
            feedback.setUsername(message.chat.username || 'Юзернейм не указан');
            await bot.editMessageText(`Вы выбрали: *${callbackData}*`, {
                chat_id: stateContext.getChatId(),
                message_id: message.message_id,
                parse_mode: 'Markdown',
                reply_markup: {inline_keyboard: []}
            });
            await stateContext.setState(new FeedbackCommentState(stateContext));
        }
    }

}

export default FeedbackEvaluateState;