import {InformatorBaseState} from "./internal";
import {Message} from "node-telegram-bot-api";
import LoginInputState from "./login-input-state";

export default class WelcomeState extends InformatorBaseState {
    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        await stateContext.sendMessage('Здравствуйте! Чтобы пользоваться ботом, необходимо авторизоваться в систему!');
        await stateContext.setState(new LoginInputState(stateContext));
    }
}