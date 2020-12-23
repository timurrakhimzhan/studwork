import {AbstractInformatorBaseState} from "./internal";
import {Message, SendMessageOptions} from "node-telegram-bot-api";
import LoginInputState from "./login-input-state";

export default class WelcomeState extends AbstractInformatorBaseState {
    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options || {reply_markup: {remove_keyboard: true}});
    }

    async initState(): Promise<any> {
        const stateContext = this.stateContext;
        await stateContext.sendMessage('Здравствуйте! Чтобы пользоваться ботом, необходимо авторизоваться в систему!');
        await stateContext.setState(new LoginInputState(stateContext));
    }

    async messageController(message: Message): Promise<any> {
        return this.stateContext.initState();
    }
}