import {AbstractStateContext} from "./internal";
import InformatorBotContext from "../../bot-contexts/informator-bot";
import TelegramBot from "node-telegram-bot-api";

export default class InformatorStateContext extends AbstractStateContext {
    protected readonly botContext: InformatorBotContext;

    constructor(botContext: InformatorBotContext, chatId: number) {
        super(botContext, chatId);
        this.botContext = botContext;
    }

    getBotContext(): InformatorBotContext {
        return this.botContext;
    }

}