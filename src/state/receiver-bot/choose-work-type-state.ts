import {ReceiverBaseState} from "./internal";
import {generateInlineMenu} from "../../utils/tg-utils";
import ChooseSubjectState from "./choose-subject-state";
import {CallbackQuery, Message, SendMessageOptions} from "node-telegram-bot-api";
import UploadFileState from "./upload-file-state";

export default class ChooseWorkTypeState extends ReceiverBaseState {
    async initState(): Promise<any> {
        const stateContext = this.stateContext;
        const subject = stateContext.getBotContext().getOrderInfo(stateContext.getChatId()).subject;
        const workTypes = subject?.workTypes;
        if(!workTypes || workTypes.length === 0) {
            await stateContext.sendMessage('Извините, типов работы по данному предмету нет');
            await stateContext.setState(new ChooseSubjectState(stateContext));
            return;
        }
        await stateContext.sendMessage('Выберите вид работы:', {
            reply_markup: {
                inline_keyboard: generateInlineMenu(workTypes)}
        });
    }

    async callbackController(callback: CallbackQuery): Promise<any> {
        const callbackData = callback.data as string;
        const message = callback.message as Message;
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const subject = botContext.getOrderInfo(stateContext.getChatId()).subject;
        const workTypeFound = subject?.workTypes
            .find((workType) => workType.name === callbackData);
        const bot = botContext.getBot()
        await bot.answerCallbackQuery(callback.id);
        if(!workTypeFound) {
            await stateContext.sendMessage('Извините, произошла ошибка во время выбора типа работы, пожалуйста, повторите попытку')
            return this.initState();
        }
        const order = botContext.getOrderInfo(stateContext.getChatId());
        await bot.editMessageText(`Выбран тип задания: *${callbackData}*.`, {
            message_id: message.message_id,
            chat_id: stateContext.getChatId(),
            parse_mode: 'Markdown',
            reply_markup: {inline_keyboard: []}
        });
        order.workType = workTypeFound;
        await stateContext.setState(new UploadFileState(stateContext));
    }
}