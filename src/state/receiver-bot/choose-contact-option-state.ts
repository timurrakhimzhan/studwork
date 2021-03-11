import {AbstractReceiverOrderState, EmailInputState, SaveOrderState} from "./internal";
import {CallbackQuery, Message} from "node-telegram-bot-api";
import {generateInlineMenu, generateReceipt} from "../../utils/message-utils";
import MainMenuState from "./main-menu-state";
import Teacher from "../../database/models/Teacher";
import Subject from "../../database/models/Subject";
import Order from "../../database/models/Order";
import {Sequelize} from "sequelize-typescript";
import {STATUS_PRICE_NOT_ASSIGNED} from "../../constants";

class ChooseContactOptionState extends AbstractReceiverOrderState {
    async initState () {
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        await stateContext.sendMessage('При необходимости уточнить детали по поводу задания, как с Вами связаться?', {reply_markup: {
                inline_keyboard: generateInlineMenu(botContext.getContactOptions()),
            }, parse_mode: 'Markdown'})
    }

    async onBackMessage(): Promise<any> {
        return this.stateContext.setState(new EmailInputState(this.stateContext, this.order));
    }

    callbackController = async (callback: CallbackQuery) => {
        const message = callback.message as Message;
        const callbackData = callback.data as string;
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const contactOptionFound = botContext.getContactOptions().find((contactOption) => contactOption.callback === callbackData);
        if(!contactOptionFound) {
            await stateContext.sendMessage('Извините, произошла ошибка обработки заказа, пожалуйста, попробуйте оформить заказ через час.')
            await stateContext.setState(new MainMenuState(stateContext));
            return;
        }
        this.order.contactOption = contactOptionFound;
        await botContext.getBot().editMessageText(`Выбран вариант: *${contactOptionFound.name}*.`, {
            chat_id: stateContext.getChatId(),
            message_id: message.message_id,
            parse_mode: 'Markdown',
            reply_markup: {inline_keyboard: []}
        });
        return stateContext.setState(new SaveOrderState(stateContext, this.order));
    }
}

export default ChooseContactOptionState;