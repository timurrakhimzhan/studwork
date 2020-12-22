import AbstractBotContext from "../abstract-bot-context";
import Feedback from "./feedback";
import {ReceiverStateContext} from "../../state/receiver-bot/internal";
import Subject from "../../database/models/Subject";
import Order from "../../database/models/Order";
import ContactOption from "../../database/models/ContactOption";
import Contact from "../../database/models/Contact";
import WorkType from "../../database/models/WorkType";

export default class ReceiverBotContext extends AbstractBotContext {
    private subjects: Array<Subject> = []
    private contactOptions: Array<ContactOption> = [];
    private contacts: Array<Contact> = [];
    private feedBacks: {[key: number]: Feedback | undefined} = {};
    private hasGivenFeedback: {[key: number]: boolean | undefined} = {};

    init = async () => {
        await Promise.all([
            this.fetchSubjects(),
            this.fetchContactOptions(),
            this.fetchContacts()
        ]);
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

    getSubjects = () => this.subjects;

    getContactOptions = () => this.contactOptions;

    getContacts = () => this.contacts;

    getFeedBack = (chatId: number): Feedback => {
        if(this.feedBacks[chatId]) {
            return this.feedBacks[chatId] as Feedback;
        }
        this.feedBacks[chatId] = new Feedback();
        return this.feedBacks[chatId] as Feedback;
    }

    setFeedbackGiven = (chatId: number, value: boolean = true): void => {
        this.hasGivenFeedback[chatId] = value;
    }

    resetFeedback = (chatId: number): void => {
        this.feedBacks[chatId] = new Feedback();
    }

    hasFeedbackGiven = (chatId: number): boolean => {
        if(this.hasGivenFeedback[chatId] !== undefined) {
            return this.hasGivenFeedback[chatId] as boolean;
        }
        this.hasGivenFeedback[chatId] = false;
        return this.hasGivenFeedback[chatId] as boolean;
    }
}