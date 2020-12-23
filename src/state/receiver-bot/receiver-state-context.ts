import {MainMenuState, AbstractStateContext, WelcomeState} from "./internal";
import {Message} from "node-telegram-bot-api";
import ReceiverBotContext from "../../bot-contexts/receiver-bot";
import Order from "../../database/models/Order";

export default class ReceiverStateContext extends AbstractStateContext {
    protected readonly botContext: ReceiverBotContext;

    getBotContext() {
        return this.botContext;
    } ;

    constructor(botContext: ReceiverBotContext, chatId: number) {
        super(botContext, chatId);
        this.botContext = botContext;
        this.state = new WelcomeState(this);
    }

    public async messageController(message: Message) {
        const botContext = this.getBotContext();
        if(message.text?.trim() === 'Вернуться в меню') {
            return this.setState(new MainMenuState(this));
        }
        if(message.text?.trim() === '/start') {
            botContext.setFeedbackGiven(this.getChatId(), false);
            await this.setState(new WelcomeState(this))
        }
        return super.messageController(message);
    }
}