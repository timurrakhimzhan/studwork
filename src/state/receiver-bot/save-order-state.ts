import {AbstractReceiverOrderState} from "./internal";
import {generateInlineMenu, generateReceipt} from "../../utils/message-utils";
import {STATUS_PRICE_NOT_ASSIGNED} from "../../constants";
import Teacher from "../../database/models/Teacher";
import {Sequelize} from "sequelize-typescript";
import Subject from "../../database/models/Subject";
import Order from "../../database/models/Order";
import MainMenuState from "./main-menu-state";

class SaveOrderState extends AbstractReceiverOrderState {
	async initState () {
		const stateContext = this.stateContext;
		const botContext = stateContext.getBotContext();
		await stateContext.sendMessage('При необходимости уточнить детали по поводу задания, как с Вами связаться?', {reply_markup: {
				inline_keyboard: generateInlineMenu(botContext.getContactOptions()),
			}, parse_mode: 'Markdown'});

	   await this.saveOrder();
	   const order = this.order;
	   await stateContext.sendMessage(generateReceipt(order));
	   await stateContext.sendMessage('Спасибо за пользование услугами нашего сервиса! ' +
			'Учитель оценит стоимость выполнения вашего задания, после чего *Вам придет уведомление об оплате*, спасибо!  ')
	   await stateContext.notifyInformatorBot(order);
	   await stateContext.setState(new MainMenuState(stateContext));
	}

	async saveOrder() {
		const stateContext = this.stateContext;
		const botContext = stateContext.getBotContext();

		const statusPriceNotAssigned = botContext.getStatuses().find(status => status.name === STATUS_PRICE_NOT_ASSIGNED);
		const order = this.order;
		const teacher = await Teacher.findOne({
			attributes: ['teacherId', 'chatId',
				[Sequelize.fn('count', Sequelize.col('orders.orderId')), 'ordersCount']
			],
			group: ['Teacher.teacherId'],
			order: Sequelize.literal('"ordersCount" ASC'),
			where: {
				mock: !!process.env['MOCK'],
				isAdmin: false,
			},
			include: [
				{
					model: Subject,
					where: {
						subjectId: order.subject.subjectId,
						mock: !!process.env['MOCK'],
					},
					duplicating: false,
					through: {
						attributes: []
					},
					attributes: []
				},
				{
					model: Order,
					required: false,
					duplicating: false,
					where: {
						mock: !!process.env['MOCK'],
					},
					attributes: []
				}
			],
		});

		const file = order.assignmentFile;
		if(file) {
            this.order.assignmentFile = await file.save();
        }

		if(!teacher) {
			await stateContext.sendMessage('Извините, в данный момент нет свободного учителя по данному предмету. Попробуйте оформить заказ позже')
			await stateContext.setState(new MainMenuState(stateContext));
			return;
		}

		if(!statusPriceNotAssigned) {
			await stateContext.sendMessage('Извините, произошла ошибка обработки заказа, пожалуйста, попробуйте оформить заказ через час.')
			await stateContext.setState(new MainMenuState(stateContext));
			return;
		}
		order.status = statusPriceNotAssigned;
		order.teacher = teacher;
		order.creationDate = new Date();
		await order.save();

		await Promise.all([
			order.$set('subject', order.subject),
			order.$set('workType', order.workType),
			order.$set('contactOption', order.contactOption),
			order.$set('status', order.status),
			order.$set('teacher', order.teacher),
            order.assignmentFile ? order.$set('assignmentFile', order.assignmentFile) : Promise.resolve(),
		]);
		const workType = await order.$get('workType', {include: [Subject]});
		if(!workType) {
			await stateContext.sendMessage('Ошибка сервера, пожалуйста, повторите попытку позже.');
			return stateContext.setState(new MainMenuState(stateContext));
		}
		order.workType = workType;
	}
}

export default SaveOrderState;