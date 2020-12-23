import AbstractBotContext from "../abstract-bot-context";
import InformatorStateContext from "../../state/informator-bot/informator-state-context";
import Status from "../../database/models/Status";

export default class InformatorBotContext extends AbstractBotContext {
    private statuses: Array<Status> = [];

    async init(): Promise<any> {
        return this.fetchStatuses();
    }

    fetchStatuses = async () => {
        this.statuses = await Status.findAll();
    }

    getStatuses = () => this.statuses;

    getChatStateContext(chatId: number): InformatorStateContext {
        if(this.chatStateContext[chatId]) {
            return this.chatStateContext[chatId] as InformatorStateContext
        }
        this.chatStateContext[chatId] = new InformatorStateContext(this, chatId);
        return this.chatStateContext[chatId] as InformatorStateContext;
    }
}