import AbstractBotContext from "../abstract-bot-context";
import {ReceiverStateContext} from "../../state/receiver-bot/internal";
import Subject from "../../database/models/Subject";
import ContactOption from "../../database/models/ContactOption";
import Contact from "../../database/models/Contact";
import WorkType from "../../database/models/WorkType";
import FeedbackType from "../../database/models/FeedbackType";
import Status from "../../database/models/Status";
import App from "../../App";
import TelegramBot from "node-telegram-bot-api";
import Order from "../../database/models/Order";

export default class ReceiverBotContext extends AbstractBotContext {
    private subjects: Array<Subject> = []
    private contactOptions: Array<ContactOption> = [];
    private contacts: Array<Contact> = [];
    private hasGivenFeedback: {[key: number]: boolean | undefined} = {};
    private app: App;

    constructor(bot: TelegramBot, app: App) {
        super(bot);
        this.app = app;
    }

    init = async () => {
        await Promise.all([
            this.fetchSubjects(),
            this.fetchContactOptions(),
            this.fetchContacts(),
            this.fetchStatuses(),
            this.fetchFeedbackTypes(),
        ]);
    }

    async notifyInformatorBot(chatIds: Array<number>, order: Order): Promise<any> {
        return this.app.notifyInformatorBot(chatIds, order)
    }

    getChatStateContext(chatId: number): ReceiverStateContext {
        if(this.chatStateContext[chatId]) {
            return this.chatStateContext[chatId] as ReceiverStateContext
        }
        this.chatStateContext[chatId] = new ReceiverStateContext(this, chatId);
        return this.chatStateContext[chatId] as ReceiverStateContext;
    }

    fetchSubjects = async () => {
        this.subjects = await Subject.findAll({
            where: {mock: !!process.env['MOCK']},
            include: [WorkType]
        });
    }

    fetchContactOptions = async () => {
        this.contactOptions = await ContactOption.findAll();
    }

    fetchContacts = async () => {
        this.contacts = await Contact.findAll();
    }

    fetchStatuses = async () => {
        this.statuses = await Status.findAll();
    }

    fetchFeedbackTypes = async () => {
        this.feedbackTypes = await FeedbackType.findAll();
    }

    getSubjects = () => this.subjects;

    getContactOptions = () => this.contactOptions;

    getContacts = () => this.contacts;

    setFeedbackGiven = (chatId: number, value: boolean = true): void => {
        this.hasGivenFeedback[chatId] = value;
    }

    hasFeedbackGiven = (chatId: number): boolean => {
        if(this.hasGivenFeedback[chatId] !== undefined) {
            return this.hasGivenFeedback[chatId] as boolean;
        }
        this.hasGivenFeedback[chatId] = false;
        return this.hasGivenFeedback[chatId] as boolean;
    }
}