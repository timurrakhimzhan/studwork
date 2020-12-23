import {AbstractInformatorBaseState, OrdersState} from "./internal";
import {KeyboardButton, Message, SendMessageOptions} from "node-telegram-bot-api";

const mainMenu: Array<Array<KeyboardButton>> =  [
    [{text: 'Мои заказы'}, {text: 'Выйти из учетной записи'}]
];

export default class MainMenuState extends AbstractInformatorBaseState {

    async sendMessage(message: string, options?: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options || {reply_markup: {keyboard: mainMenu, resize_keyboard: true}});
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
        await this.stateContext.initState();
    }
}