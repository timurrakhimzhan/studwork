import {AbstractInformatorBaseState, PasswordInputState} from "./internal";
import {Message} from "node-telegram-bot-api";

export default class LoginInputState extends AbstractInformatorBaseState {
    async initState(): Promise<any> {
        return this.stateContext.sendMessage('Введите логин:', {reply_markup: {keyboard: []}});
    }


    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        if(!message.text?.trim().length) {
            return stateContext.sendMessage('Логин не должен быть пустым');
        }
        const teacher = stateContext.getTeacher();
        teacher.login = message.text;
        await stateContext.setState(new PasswordInputState(stateContext));
    }
}