import {BaseState, PaymentState} from "./internal";
import TelegramBot, {CallbackQuery, Message} from "node-telegram-bot-api";


const chooseContactOptionInlineMenu = [
    [{text: 'Телефон', callback_data: 'Телефон'}, {text: 'Почта', callback_data: 'Почта'}],
    [{text: 'Telegram', callback_data: 'Telegram'}]];

class ChooseContactOptionState extends BaseState {
    async initState () {
        await this.context.sendMessage('Куда Ваc оповестить о завершение работы?')
    }

    async sendMessage (message: string): Promise<Message> {
         return super.sendMessage(message, {reply_markup: {
                 inline_keyboard: chooseContactOptionInlineMenu,
             }, parse_mode: 'Markdown'})
    }

    callbackController = async (callback: CallbackQuery) => {
        const message = callback.message as Message;
        const callbackData = callback.data as string;
        const stateContext = this.context;
        if(callbackData !== 'Телефон' && callbackData !== 'Почта' && callbackData !== 'Telegram') {
            await this.context.sendMessage('Ошибка при выборе варианта связи, пожалуйста. повторите попытку.')
            return;
        }
        const app = stateContext.getApp();
        app.getOrderInfo(stateContext.getChatId()).setContactOption(callbackData);
        await stateContext.getBot().editMessageText(`Выбран вариант: *${callbackData}*.`, {
            chat_id: stateContext.getChatId(),
            message_id: message.message_id,
            parse_mode: 'Markdown',
            reply_markup: {inline_keyboard: []}
        });

        await stateContext.setState(new PaymentState(stateContext));
    }
}

export default ChooseContactOptionState;