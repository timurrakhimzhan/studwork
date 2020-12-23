import {AbstractInformatorBaseState, OrdersState, WelcomeState, FeedbacksState} from "./internal";
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";
import LoginInputState from "./login-input-state";

const keyboardMarkup: Array<Array<KeyboardButton>> =  [
    [{text: 'Мои заказы'}, {text: 'Выйти из учетной записи'}]
];

export default class MainMenuState extends AbstractInformatorBaseState {

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        const stateContext = this.stateContext;
        const teacher = stateContext.getTeacher();

        if(teacher.isAdmin) {
            return super.sendMessage(message, options || {reply_markup: {
                keyboard: [...keyboardMarkup, [{text: 'Отзывы'}]],
                resize_keyboard: true
            }});
        }
        return super.sendMessage(message, options || {reply_markup: {keyboard: keyboardMarkup, resize_keyboard: true}});
    }

    async initState(): Promise<any> {
        return this.stateContext.sendMessage('Выберите интересующую вас тему: ');
    }

    async messageController(message: Message): Promise<any> {
        const stateContext = this.stateContext;
        if(message.text?.trim() === 'Мои заказы') {
            return stateContext.setState(new OrdersState(stateContext));
        }
        if(message.text?.trim() === 'Выйти из учетной записи') {
            await stateContext.sendMessage('До свидания!');
            return stateContext.logout();
        }
        const teacher = stateContext.getTeacher();
        if(message.text?.trim() === 'Отзывы' && teacher.isAdmin) {
            return stateContext.setState(new FeedbacksState(stateContext));
        }
        await this.stateContext.initState();
    }
}