import AbstractBotContext from "../abstract-bot-context";
import InformatorStateContext from "../../state/informator-bot/informator-state-context";
import Status from "../../database/models/Status";
import FeedbackType from "../../database/models/FeedbackType";
import Teacher from "../../database/models/Teacher";
import {Op} from "sequelize";
import TelegramBot from "node-telegram-bot-api";
import App from "../../App";

export default class InformatorBotContext extends AbstractBotContext {
    private app: App;

    constructor(bot: TelegramBot, app: App) {
        super(bot);
        this.app = app;
    }

    async init(): Promise<any> {
        return await Promise.all([
            this.fetchStatuses(),
            this.fetchFeedbackTypes(),
            this.fetchTeachers(),
        ])
    }

    async notifyReceiverBot(chatIds: Array<number>, message: string): Promise<any> {
        return this.app.notifyReceiverBot(chatIds, message)
    }

    fetchStatuses = async () => {
        this.statuses = await Status.findAll();
    }

    fetchFeedbackTypes = async () => {
        this.feedbackTypes = await FeedbackType.findAll();
    }

    fetchTeachers = async () => {
        const teachersLoggedIn = await Teacher.findAll({
            where: {
                chatId: {
                    [Op.ne]: null
                }
            }
        });
        await Promise.all(teachersLoggedIn.map(async (teacherLoggedIn) => {
            if(!teacherLoggedIn.chatId) {
                return;
            }
            const stateContext = this.getChatStateContext(teacherLoggedIn.chatId);
            await stateContext.setTeacher(teacherLoggedIn);
            await stateContext.login();
        }))
    }

    getChatStateContext(chatId: number): InformatorStateContext {
        if(this.chatStateContext[chatId]) {
            return this.chatStateContext[chatId] as InformatorStateContext
        }
        this.chatStateContext[chatId] = new InformatorStateContext(this, chatId);
        return this.chatStateContext[chatId] as InformatorStateContext;
    }
}