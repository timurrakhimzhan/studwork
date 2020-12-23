import AbstractBotContext from "../abstract-bot-context";
import InformatorStateContext from "../../state/informator-bot/informator-state-context";
import Status from "../../database/models/Status";
import FeedbackType from "../../database/models/FeedbackType";

export default class InformatorBotContext extends AbstractBotContext {
    async init(): Promise<any> {
        return await Promise.all([
            this.fetchStatuses(),
            this.fetchFeedbackTypes()
        ])
    }

    fetchStatuses = async () => {
        this.statuses = await Status.findAll();
    }

    fetchFeedbackTypes = async () => {
        this.feedbackTypes = await FeedbackType.findAll();
    }

    getChatStateContext(chatId: number): InformatorStateContext {
        if(this.chatStateContext[chatId]) {
            return this.chatStateContext[chatId] as InformatorStateContext
        }
        this.chatStateContext[chatId] = new InformatorStateContext(this, chatId);
        return this.chatStateContext[chatId] as InformatorStateContext;
    }
}