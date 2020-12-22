import {ReceiverBaseState, ChooseContactOptionState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";
import App from "../../App";


const regex = /\S+@\S+\.\S+/;

class EmailInputState extends ReceiverBaseState {

    async initState() {
        await this.stateContext.sendMessage('Введите Ваш адрес электронной почты:');
    }

    async messageController(message: Message) {
        const stateContext = this.stateContext;
        if(!message.text || !regex.test(message.text)) {
            await stateContext.sendMessage('Некорректный адрес электронной почты, пожалуйста, повторите попытку.')
            return;
        }
        const order = stateContext.getOrder();
        order.email = message.text;

        await stateContext.setState(new ChooseContactOptionState(stateContext))
    }
}

export default EmailInputState;