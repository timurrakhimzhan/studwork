import {MainMenuState} from "./internal";
import {Message} from "node-telegram-bot-api";
import FeedbackState from "./feedback-state";

class FeedbackCommentState extends FeedbackState {

    async initState() {
        await this.stateContext.sendMessage('Оставьте свой комментарий:');
    }

    async messageController (message: Message) {
        const stateContext = this.stateContext;
        if(!message.text?.trim().length) {
            return stateContext.sendMessage('Комментарий должен содержать символы.')
        }
        const botContext = stateContext.getBotContext();
        this.feedback.comment = message.text;
        botContext.setFeedbackGiven(stateContext.getChatId(), true);
        await this.feedback.save();
        await this.feedback.$set('feedbackType', this.feedback.feedbackType);
        await stateContext.sendMessage('Спасибо! Можете присоединиться к нам в общий чат: @StudWorkChat');
        await stateContext.setState(new MainMenuState(stateContext));
    }
}

export default FeedbackCommentState;