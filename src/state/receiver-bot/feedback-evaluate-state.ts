import {FeedbackCommentState} from "./internal";
import {CallbackQuery, Message} from "node-telegram-bot-api";
import FeedbackState from "./feedback-state";
import {generateInlineMenu} from "../../utils/message-utils";
import {feedbackTypeMeaningMap} from "../../database/models/FeedbackType";


class FeedbackEvaluateState extends FeedbackState {
    async initState() {
        const stateContext = this.stateContext;
        const feedbackTypes = stateContext.getBotContext().getFeedbackTypes();

        await stateContext.sendMessage('Пожалуйста, оставьте оценку.');
        await stateContext.sendMessage('Оцените работу бота:', {reply_markup: {
            inline_keyboard: generateInlineMenu(feedbackTypes.map((feedbackType) => ({name: feedbackTypeMeaningMap[feedbackType.name], callback: feedbackType.name}))),
            remove_keyboard: true
        }});
    }

    async callbackController (callback: CallbackQuery) {
        const message = callback.message as Message;
        const callbackData = callback.data as string;
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const bot = botContext.getBot();
        const feedbackTypes = stateContext.getBotContext().getFeedbackTypes();
        const feedbackTypeFound = feedbackTypes.find((feedbackType) => feedbackType.name === callbackData);
        if(feedbackTypeFound) {
            await bot.answerCallbackQuery(callback.id);
            this.feedback.feedbackType = feedbackTypeFound;
            this.feedback.username = message.chat.username || null;
            this.feedback.chatId = message.chat.id;
            await bot.editMessageText(`Вы выбрали: *${feedbackTypeMeaningMap[feedbackTypeFound.name]}*`, {
                chat_id: stateContext.getChatId(),
                message_id: message.message_id,
                parse_mode: 'Markdown',
                reply_markup: {inline_keyboard: []}
            });
            await stateContext.setState(new FeedbackCommentState(stateContext, this.feedback));
        }
    }

}

export default FeedbackEvaluateState;