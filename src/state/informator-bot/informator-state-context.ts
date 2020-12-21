import {AbstractStateContext} from "./internal";
import InformatorBotContext from "../../bot-contexts/informator-bot";
import TelegramBot from "node-telegram-bot-api";
import LoginInputState from "./login-input-state";
import Teacher from "../../database/models/Teacher";

export default class InformatorStateContext extends AbstractStateContext {
    protected readonly botContext: InformatorBotContext;
    constructor(botContext: InformatorBotContext, chatId: number) {
        super(botContext, chatId);
        this.botContext = botContext;
        this.state = new LoginInputState(this);
    }

    getBotContext(): InformatorBotContext {
        return this.botContext;
    }

}