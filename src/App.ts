import {connectInformatorBot, connectPayment, connectReceiverBot} from "./connections/connect-telegram-bots";
import ReceiverBotContext from "./bot-contexts/receiver-bot";
import InformatorBotContext from "./bot-contexts/informator-bot";

class App {

    private receiverBotContext: ReceiverBotContext | null = null;
    private informatorBotContext: InformatorBotContext | null = null;

    public init = async () => {
        const receiverBot = connectReceiverBot();
        const informatorBot = connectInformatorBot();
        this.receiverBotContext = new ReceiverBotContext(receiverBot);
        this.informatorBotContext = new InformatorBotContext(informatorBot);
    }

    getReceiverBotContext = (): ReceiverBotContext => this.receiverBotContext as ReceiverBotContext;

    getInformatorBotContext = (): InformatorBotContext => this.informatorBotContext as InformatorBotContext;
}


export default App;