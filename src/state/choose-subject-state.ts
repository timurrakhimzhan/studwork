import {BaseState, UploadFileState} from "./internal";
import {generateInlineMenu} from "../utils";
import {CallbackQuery, Message, PreCheckoutQuery} from "node-telegram-bot-api";

class ChooseSubjectState extends BaseState{
     async sendMessage(message: string): Promise<Message> {
        return super.sendMessage(message, {reply_markup: {
            inline_keyboard: generateInlineMenu(this.context.getApp().getSubjects())
        }});
    }
    async initState () {
        await this.context.sendMessage('Выберите предмет:');
    }

    async callbackController(callback: CallbackQuery) {
        const message = callback.message as Message;
        const callbackData = callback.data as string;
        const stateContext = this.context;
        const bot = stateContext.getBot();
        const app = stateContext.getApp();
        const subjectFound = app.getSubjects().find((subject) => subject.name === callbackData);
        if(subjectFound) {
            app.getOrderInfo(stateContext.getChatId()).setSubject(subjectFound);
            await bot.editMessageText(`Выбран предмет: *${callbackData}*.`, {
                chat_id: stateContext.getChatId(),
                message_id: message.message_id,
                parse_mode: 'Markdown',
                reply_markup: {inline_keyboard: []}
            });
            await bot.answerCallbackQuery(callback.id);
            await stateContext.setState(new UploadFileState(stateContext));
        } else {
            await stateContext.sendMessage('Произошла ошибка во время выбора предмета, пожалуйста, повторите попытку.')
        }
    }
}

export default ChooseSubjectState;