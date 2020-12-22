import {
    ChooseContactOptionState,
    ReceiverOrderState,
    PhoneInputState
} from "./internal";
import {Message} from "node-telegram-bot-api";


const regex = /\S+@\S+\.\S+/;

class EmailInputState extends ReceiverOrderState {

    async initState() {
        await this.stateContext.sendMessage('Введите Ваш адрес электронной почты:');
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new PhoneInputState(this.stateContext, this.order));
    }

    async messageController(message: Message) {
        const stateContext = this.stateContext;
        if(!message.text || !regex.test(message.text)) {
            await stateContext.sendMessage('Некорректный адрес электронной почты, пожалуйста, повторите попытку.')
            return;
        }
        this.order.email = message.text;
        await stateContext.setState(new ChooseContactOptionState(stateContext, this.order))
    }
}

export default EmailInputState;