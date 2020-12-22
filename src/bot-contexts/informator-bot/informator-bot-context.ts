import AbstractBotContext from "../abstract-bot-context";
import InformatorStateContext from "../../state/informator-bot/informator-state-context";

export default class InformatorBotContext extends AbstractBotContext {
    getChatStateContext(chatId: number): InformatorStateContext {
        if(this.chatStateContext[chatId]) {
            return this.chatStateContext[chatId] as InformatorStateContext
        }
        this.chatStateContext[chatId] = new InformatorStateContext(this, chatId);
        return this.chatStateContext[chatId] as InformatorStateContext;
    }
}