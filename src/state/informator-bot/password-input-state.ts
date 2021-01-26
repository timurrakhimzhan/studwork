import {AbstractInformatorBaseState, MainMenuState, LoginInputState} from "./internal";
import {Message} from "node-telegram-bot-api";
import AuthenticationError from "../../errors/authentication-error";
import {ERROR_TOO_MANY_ATTEMPTS, ERROR_WRONG_CREDENTIALS} from "../../constants";

export default class PasswordInputState extends AbstractInformatorBaseState {
    async initState(): Promise<any> {
        return this.stateContext.sendMessage('Введите пароль:');
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        if(!message.text?.trim().length) {
            return stateContext.sendMessage('Пароль не должен быть пустым');
        }
        const teacher = stateContext.getTeacher();
        teacher.password = message.text;
        try {
            await stateContext.login(message.chat.username);
        } catch (error) {
            if(error instanceof AuthenticationError) {
                if(error.getType() === ERROR_TOO_MANY_ATTEMPTS) {
                    await stateContext.sendMessage('Слишком много попыток, повторите позже.');
                } else {
                    await stateContext.sendMessage('Неверное сочетание логина и пароля, повторите еще раз');

                }
                stateContext.resetTeacher();
                return stateContext.setState(new LoginInputState(stateContext));
            }
            return stateContext.sendMessage('Пароль не должен быть пустым');
        }
        await stateContext.sendMessage('Авторизация успешно совершена!');
        await stateContext.setState(new MainMenuState(stateContext))
    }
}