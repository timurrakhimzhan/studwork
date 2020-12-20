import {ReceiverBaseState} from "./internal";
import {CallbackQuery, Message} from "node-telegram-bot-api";
import {generateInlineMenu} from "../../utils/tg-utils";
import MainMenuState from "./main-menu-state";
import ReceiptGenerator from "../../utils/ReceiptGenerator";
import Status from "../../database/models/Status";
import Teacher from "../../database/models/Teacher";
import Subject from "../../database/models/Subject";

class ChooseContactOptionState extends ReceiverBaseState {
    async initState () {
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        await stateContext.sendMessage('При необходимости уточнить детали по поводу задания, как с Вами связаться?', {reply_markup: {
                inline_keyboard: generateInlineMenu(botContext.getContactOptions()),
            }, parse_mode: 'Markdown'})
    }

    callbackController = async (callback: CallbackQuery) => {
        const message = callback.message as Message;
        const callbackData = callback.data as string;
        const stateContext = this.stateContext;
        const botContext = stateContext.getBotContext();
        const order = botContext.getOrderInfo(stateContext.getChatId());
        const contactOptionFound = botContext.getContactOptions().find((contactOption) => contactOption.callback === callbackData);
        const statusPriceNotAssigned = await Status.findOne({where: {
                name: 'STATUS_PRICE_NOT_ASSIGNED'
            }});
        const teacher = await Teacher.findOne({
            include: [
                {
                    model: Subject,
                    where: {
                        name: order.subject.name,
                    }
                }
            ]
        });
        if(!statusPriceNotAssigned || !teacher || !contactOptionFound) {
            await stateContext.sendMessage('Извините, произошла ошибка обработки заказа, пожалуйста, попробуйте оформить заказ через час.')
            await stateContext.setState(new MainMenuState(stateContext));
            return;
        }
        order.contactOption = contactOptionFound;
        order.status = statusPriceNotAssigned;
        order.teacher = teacher;
        await order.save();

        await Promise.all([
            order.$set('subject', order.subject),
            order.$set('workType', order.workType),
            order.$set('contactOption', order.contactOption),
            order.$set('status', order.status),
            order.$set('teacher', order.teacher),
        ]);
        await botContext.getBot().editMessageText(`Выбран вариант: *${callbackData}*.`, {
            chat_id: stateContext.getChatId(),
            message_id: message.message_id,
            parse_mode: 'Markdown',
            reply_markup: {inline_keyboard: []}
        });
        await stateContext.sendMessage(ReceiptGenerator.generateReceiptForClient(order));
        await stateContext.sendMessage('Спасибо за пользование услугами нашего сервиса! ' +
            'Учитель оценит стоймость выполнения вышего задания, после чего *Вам придет уведомление об оплате*, спасибо!')
        await stateContext.setState(new MainMenuState(stateContext));
    }
}

export default ChooseContactOptionState;