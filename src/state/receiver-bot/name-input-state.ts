import {AbstractReceiverBaseState, ChooseSubjectState, AbstractReceiverOrderState, MainMenuState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";

class NameInputState extends AbstractReceiverOrderState {
    async initState() {
        await this.stateContext.sendMessage('Как вас зовут?');
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new MainMenuState(this.stateContext));
    }

    async messageController (message: Message) {
        if(!message.text) {
            await this.sendMessage('Некорректно введено имя, пожалуйста, повторите попытку.');
            return;
        }
        const stateContext = this.stateContext;
        this.order.clientName = message.text;
        this.order.username = message.chat.username || null;
        this.order.chatId = message.chat.id;
        await stateContext.setState(new ChooseSubjectState(stateContext, this.order));
    }
}

export default NameInputState;