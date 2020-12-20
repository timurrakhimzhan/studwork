import {MainMenuState, AbstractStateContext} from "./internal";
import {Message} from "node-telegram-bot-api";
import ReceiverBotContext from "../../bot-contexts/receiver-bot";

export default class ReceiverStateContext extends AbstractStateContext {
    protected readonly botContext: ReceiverBotContext;

    getBotContext() {
        return this.botContext;
    } ;

    constructor(botContext: ReceiverBotContext, chatId: number) {
        super(botContext, chatId);
        this.botContext = botContext;
        this.state = new MainMenuState(this);
    }

    public messageController = async (message: Message) => {
        const botContext = this.getBotContext();
        try {
            await this.state.onNewMessage();
        } catch(e) {}
        if(message.text?.trim() === 'Вернуться в меню') {
            return this.setState(new MainMenuState(this));
        }
        if(message.text?.trim() === '/start') {
            botContext.setFeedbackGiven(this.getChatId(), false);
            botContext.resetFeedback(this.getChatId());
            botContext.resetOrderInfo(this.getChatId());
            await this.sendMessage('Добрый день! Вас приветствует компания StudWork!');
            return this.setState(new MainMenuState(this));
        }
        return this.state.messageController(message);
    }
}