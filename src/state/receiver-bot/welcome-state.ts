import {ReceiverBaseState} from "./internal";
import {Message} from "node-telegram-bot-api";
import MainMenuState from "./main-menu-state";

export default class WelcomeState extends ReceiverBaseState {
    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        await stateContext.sendMessage('Добрый день! Вас приветствует компания StudWork!');
        await stateContext.setState(new MainMenuState(stateContext));
    }
}