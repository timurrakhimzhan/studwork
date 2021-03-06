import {MainMenuState, NameInputState, ChooseWorkTypeState, AbstractReceiverOrderState} from "./internal";
import {generateInlineMenu} from "../../utils/message-utils";
import {CallbackQuery, Message, SendMessageOptions} from "node-telegram-bot-api";

class ChooseSubjectState extends AbstractReceiverOrderState {
    async initState () {
        const stateContext = this.stateContext;
        const subjects = stateContext.getBotContext().getSubjects();
        if(!subjects || !subjects.length) {
            await stateContext.sendMessage('Извините, в данный момент нет доступных предметов.');
            return stateContext.setState(new MainMenuState(stateContext));
        }
        await stateContext.sendMessage('Выберите предмет:', {reply_markup: {
                inline_keyboard: generateInlineMenu(this.stateContext.getBotContext().getSubjects())
            }});
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new NameInputState(this.stateContext, this.order));
    }

    async callbackController(callback: CallbackQuery) {
        const message = callback.message as Message;
        const callbackData = callback.data as string;
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const bot = botContext.getBot();
        const subjectFound = botContext.getSubjects().find((subject) => subject.name === callbackData);
        await bot.answerCallbackQuery(callback.id);
        if(!subjectFound) {
            await stateContext.sendMessage('Извините, произошла ошибка во время выбора предмета, пожалуйста, повторите попытку.')
            return stateContext.initState();
        }
        this.order.subject = subjectFound;
        await bot.editMessageText(`Выбран предмет: *${callbackData}*.`, {
            chat_id: stateContext.getChatId(),
            message_id: message.message_id,
            parse_mode: 'Markdown',
            reply_markup: {inline_keyboard: []}
        });
        await stateContext.setState(new ChooseWorkTypeState(stateContext, this.order));

    }
}

export default ChooseSubjectState;