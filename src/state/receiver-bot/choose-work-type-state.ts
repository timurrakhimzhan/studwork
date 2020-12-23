import {ChooseSubjectState, AbstractReceiverOrderState, UploadFileState} from "./internal";
import {generateInlineMenu} from "../../utils/message-utils";
import {CallbackQuery, Message} from "node-telegram-bot-api";

export default class ChooseWorkTypeState extends AbstractReceiverOrderState {
    async initState(): Promise<any> {
        const stateContext = this.stateContext;
        const workTypes = this.order.subject.workTypes;
        if(!workTypes || workTypes.length === 0) {
            await stateContext.sendMessage('Извините, типов работы по данному предмету нет');
            await stateContext.setState(new ChooseSubjectState(stateContext, this.order));
            return;
        }
        await stateContext.sendMessage('Выберите вид работы:', {
            reply_markup: {
                inline_keyboard: generateInlineMenu(workTypes)}
        });
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new ChooseSubjectState(this.stateContext, this.order
        ))
    }

    async callbackController(callback: CallbackQuery): Promise<any> {
        const callbackData = callback.data as string;
        const message = callback.message as Message;
        const stateContext = this.stateContext;
        const workTypeFound = this.order.subject.workTypes
            .find((workType) => workType.name === callbackData);
        const bot = stateContext.getBotContext().getBot();
        await bot.answerCallbackQuery(callback.id);
        if(!workTypeFound) {
            await stateContext.sendMessage('Извините, произошла ошибка во время выбора типа работы, пожалуйста, повторите попытку')
            return stateContext.initState();
        }
        await bot.editMessageText(`Выбран тип задания: *${callbackData}*.`, {
            message_id: message.message_id,
            chat_id: stateContext.getChatId(),
            parse_mode: 'Markdown',
            reply_markup: {inline_keyboard: []}
        });
        this.order.workType = workTypeFound;
        await stateContext.setState(new UploadFileState(stateContext, this.order));
    }
}