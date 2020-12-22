import {ReceiverBaseState, MainMenuState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";

class FeedbackCommentState extends ReceiverBaseState {

    async initState() {
        await this.stateContext.sendMessage('Оставьте свой комментарий:');
    }

    async messageController (message: Message) {
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const feedBack = botContext.getFeedBack(message.chat.id);
        feedBack.setComment(message.text || '')
        botContext.setFeedbackGiven(stateContext.getChatId(), true);
        await stateContext.sendMessage('Спасибо! Можете присоединиться к нам в общий чат: @StudWorkChat');
        // await addFeedback(botContext.getDoc(), stateContext.getChatId(), feedBack)

        await stateContext.setState(new MainMenuState(stateContext));
    }
}

export default FeedbackCommentState;