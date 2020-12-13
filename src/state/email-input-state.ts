import {BaseState, ChooseContactOptionState} from "./internal";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";
import App from "../App";


const regex = /\S+@\S+\.\S+/;

class EmailInputState extends BaseState {

    async initState() {
        await this.context.sendMessage('Введите Ваш адрес электронной почты:');
    }

    async messageController(message: Message) {
        const stateContext = this.context;
        if(!message.text || !regex.test(message.text)) {
            await stateContext.sendMessage('Некорректный адрес электронной почты, пожалуйста, повторите попытку.')
            return;
        }
        const app = stateContext.getApp();
        app.getOrderInfo(stateContext.getChatId()).setEmail(message.text);

        await stateContext.setState(new ChooseContactOptionState(stateContext))
    }
}

export default EmailInputState;