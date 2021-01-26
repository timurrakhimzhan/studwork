import {NameInputState, FeedbackEvaluateState, AbstractReceiverBaseState} from "./internal";
import {
    CallbackQuery,
    KeyboardButton,
    Message,
    SendMessageOptions,
} from "node-telegram-bot-api";
import {generateInlineMenu, generatePriceList, generateSubjectsMessage} from "../../utils/message-utils";
import {OrdersState} from "./internal";
import Order from "../../database/models/Order";
import Feedback from "../../database/models/Feedback";
import {CALLBACK_PHONE_CALL} from "../../constants";

const mainMenu: Array<Array<KeyboardButton>> =  [
    [{text: 'Предметы'}, {text: 'Заказать работу'}],
    [{text: 'Прайс-лист'}, {text: 'Мои заказы'}],
    [{text: 'Контакты'}, {text: 'Оценить работу бота'}]
];

class MainMenuState extends AbstractReceiverBaseState {
     async sendMessage (message: string, options: SendMessageOptions): Promise<Message> {
        return super.sendMessage(message, options || {reply_markup: {keyboard: mainMenu, resize_keyboard: true}})
    }

    async initState(): Promise<any> {
        await this.stateContext.sendMessage('Выберите интересующую вас тему:');
    }

    async messageController(message: Message): Promise<any> {
        const botContext = this.stateContext.getBotContext();
        const stateContext = this.stateContext;
        if(message.text?.trim() === 'Предметы') {
            if(botContext.getSubjects().length === 0) {
                return stateContext.sendMessage('Извините, список предметов в данный момент пусть.');
            }
            return stateContext.sendMessage(generateSubjectsMessage(botContext.getSubjects()))
        }
        if(message.text?.trim() === 'Прайс-лист') {
            if(botContext.getSubjects().length === 0) {
                return stateContext.sendMessage('Извините, список предметов в данный момент пусть.');
            }
            return stateContext.sendMessage('Выберите предмет:',
                {reply_markup: {inline_keyboard: generateInlineMenu(botContext.getSubjects())}});
        }
        if(message.text?.trim() === 'Контакты') {
            return stateContext.sendMessage('Контакты:', {reply_markup: {
                inline_keyboard: generateInlineMenu(botContext.getContacts())
            }});
        }
        if(message.text?.trim() === 'Оценить работу бота') {
            if(botContext.hasFeedbackGiven(message.chat.id)) {
                return stateContext.sendMessage('Вы уже оценили работу бота. Можете присоединиться к нам в общий чат: @StudWorkChat');
            } else {
                return stateContext.setState(new FeedbackEvaluateState(stateContext, new Feedback()))
            }
        }
        if(message.text?.trim() === 'Заказать работу') {
            const order = new Order();
            order.mock = !!process.env['MOCK'];
            return stateContext.setState(new NameInputState(stateContext, order));
        }
        if(message.text?.trim() === 'Мои заказы') {
            return stateContext.setState(new OrdersState(stateContext));
        }
        await this.stateContext.initState();
    }

    async callbackController(callback: CallbackQuery): Promise<any> {
        const callbackData = callback.data as string;
        const message = callback.message as Message;
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const bot = botContext.getBot();
        await bot.answerCallbackQuery(callback.id);
        if(callbackData === CALLBACK_PHONE_CALL) {
            await bot.sendContact(stateContext.getChatId(), '+77756818268', 'StudWork');
        }
        const subjectForPrice = botContext.getSubjects().find((subject) => subject.name === callbackData)
        if(subjectForPrice) {
            await bot.editMessageText(generatePriceList(subjectForPrice), {
                chat_id: stateContext.getChatId(),
                message_id: message.message_id,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: generateInlineMenu(botContext.getSubjects())
                }
            })
        }
    }
}



export default MainMenuState;