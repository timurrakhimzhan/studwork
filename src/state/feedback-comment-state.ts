import {BaseState, MainMenuState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";
import {addFeedback} from "../controllers/google-spreadsheet-controller";

class FeedbackCommentState extends BaseState {

    async initState() {
        await this.context.sendMessage('Оставьте свой комментарий:');
    }

    async messageController (message: Message) {
        const stateContext = this.context;
        const app = stateContext.getApp();
        const feedBack = app.getFeedBack(message.chat.id);
        feedBack.setComment(message.text || '')
        app.setFeedbackGiven(stateContext.getChatId(), true);
        await stateContext.sendMessage('Спасибо! Можете присоединиться к нам в общий чат: @StudWorkChat');
        await addFeedback(app.getDoc(), stateContext.getChatId(), feedBack)

        await stateContext.setState(new MainMenuState(stateContext));
    }
}

export default FeedbackCommentState;