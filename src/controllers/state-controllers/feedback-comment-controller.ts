import TelegramBot, {Message} from "node-telegram-bot-api";
import App from "../../App";
import {FEEDBACK_GIVEN, MAIN_MENU} from "../../states";
import {addFeedback} from "../google-spreadsheet-controller";
import {receiverSendMessage} from "../telegram-bot-controllers";

export const feedbackCommentMessageController = async (bot: TelegramBot, message: Message) => {
    const app = App.getInstance();
    const feedBack = app.getFeedBack(message.chat.id);
    app.setChatState(message.chat.id, MAIN_MENU);
    app.setFeedbackGiven(message.chat.id, true);
    feedBack.setComment(message.text || '')
    await receiverSendMessage(message.chat.id, 'Спасибо! Можете присоединиться к нам в общий чат: @StudWorkChat')
    await addFeedback(message.chat.id, feedBack);
}