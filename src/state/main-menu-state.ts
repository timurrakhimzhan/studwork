import {BaseState, NameInputState, FeedbackEvaluateState } from "./internal";
import {
    CallbackQuery,
    KeyboardButton,
    Message,
    SendMessageOptions,
} from "node-telegram-bot-api";
import {generatePriceList, generateSubjectsMessage} from "../utils";

const mainMenu: Array<Array<KeyboardButton>> =  [
    [{text: 'Предметы'}, {text: 'Заказать работу'}],
    [{text: 'Прайс-лист'}, {text: 'Контакты'}],
    [{text: 'Оценить работу бота'}]
];

const contactsInlineMenu = [[
    {text: 'Позвонить', callback_data: 'Позвонить'},
    {text: 'Whatsapp', url: 'https://wa.me/77756818268'}],
    [{text: 'Telegram', url: 'https://t.me/StudWorkk'}]];

class MainMenuState extends BaseState {
     async sendMessage (message: string, options: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options || {reply_markup: {keyboard: mainMenu, resize_keyboard: true}})
    }

     async messageController(message: Message): Promise<any> {
        const app = this.context.getApp();
        const stateContext = this.context;
        if(message.text?.trim() === 'Предметы') {
            return stateContext.sendMessage(generateSubjectsMessage(app.getSubjects()))
        }
        if(message.text?.trim() === 'Прайс-лист') {
            return stateContext.sendMessage(generatePriceList(app.getSubjects()));
        }
        if(message.text?.trim() === 'Контакты') {
            return stateContext.sendMessage('Контакты:', {reply_markup: {inline_keyboard: contactsInlineMenu}});
        }
        if(message.text?.trim() === 'Оценить работу бота') {
            if(app.hasFeedbackGiven(message.chat.id)) {
                return stateContext.sendMessage('Вы уже оценили работу бота. Можете присоединиться к нам в общий чат: @StudWorkChat');
            } else {
                return stateContext.setState(new FeedbackEvaluateState(stateContext))
            }
        }
        if(message.text?.trim() === 'Заказать работу') {
            return stateContext.setState(new NameInputState(stateContext));
        }
        await this.context.sendMessage('Выберите интересующую вас тему');
    }

    async callbackController(callback: CallbackQuery): Promise<any> {
        const callbackData = callback.data as string;
        const stateContext = this.context;
        const bot = stateContext.getBot();
        if(callbackData === 'Позвонить') {
            await bot.sendContact(stateContext.getChatId(), '+77756818268', 'StudWork');
            await bot.answerCallbackQuery(callback.id);
        }
    }
}



export default MainMenuState;