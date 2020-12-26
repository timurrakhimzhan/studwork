import {connectInformatorBot, connectReceiverBot} from "./connections/connect-telegram-bots";
import ReceiverBotContext from "./bot-contexts/receiver-bot";
import InformatorBotContext from "./bot-contexts/informator-bot";
import Order from "./database/models/Order";

class App {

    private receiverBotContext: ReceiverBotContext | null = null;
    private informatorBotContext: InformatorBotContext | null = null;

    public init = async () => {
        const receiverBot = connectReceiverBot();
        const informatorBot = connectInformatorBot();
        this.receiverBotContext = new ReceiverBotContext(receiverBot, this);
        this.informatorBotContext = new InformatorBotContext(informatorBot, this);
        await Promise.all([
            this.receiverBotContext.init(),
            this.informatorBotContext.init()
        ]);
    }

    async notifyReceiverBot(chatIds: Array<number>, order: Order): Promise<any> {
        const botContext = this.getReceiverBotContext();
        return botContext.notifyAboutOrders(chatIds, order)
    }

    async notifyInformatorBot(chatIds: Array<number>, order: Order): Promise<any> {
        const botContext = this.getInformatorBotContext();
        return botContext.notifyAboutOrders(chatIds, order)
    }

    getReceiverBotContext = (): ReceiverBotContext => this.receiverBotContext as ReceiverBotContext;

    getInformatorBotContext = (): InformatorBotContext => this.informatorBotContext as InformatorBotContext;
}


export default App;