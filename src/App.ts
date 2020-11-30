import {MAIN_MENU} from "./states";
import OrderInfo from './OrderInfo';
import TelegramBot from "node-telegram-bot-api";
import {connectInformatorBot, connectReceiverBot} from "./connections/connect-telegram-bots";
import {GoogleSpreadsheet} from "google-spreadsheet";
import connectGoogleSpreadsheet from "./connections/connect-google-spreadsheet";
import Feedback from "./Feedback";

class App {
    private subjects: Array<{name: string, price: string}> = []
    private chatState: {[key: number]: string | undefined} = {};
    private orderInfos: {[key: number]: OrderInfo | undefined} = {};

    private feedBacks: {[key: number]: Feedback | undefined} = {};
    private hasGivenFeedback: {[key: number]: boolean | undefined} = {};

    private doc: GoogleSpreadsheet | null = null;
    private receiverBot: TelegramBot | null = null;
    private informatorBot: TelegramBot | null = null;

    private static instance: App;

    public static getInstance = (): App => {
        if(!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    public init = async () => {
        this.doc = await connectGoogleSpreadsheet();
        this.receiverBot = await connectReceiverBot();
        this.informatorBot = await connectInformatorBot();
    }

    setSubjects = (subjects: Array<{name: string, price: string}>) => {
        this.subjects = subjects;
    }

    getSubjects = () => this.subjects;

    getSubjectPrice = (subject: string): string | null => {
        const found = this.subjects.find((item) => item.name === subject);
        return found?.price || null;
    }

    setChatState = (chatId: number, state: string) => {
        this.chatState[chatId] = state;
    }

    getChatState = (chatId: number): string => {
        if(this.chatState[chatId]) {
            return this.chatState[chatId] as string;
        }
        this.setChatState(chatId, MAIN_MENU);
        return this.chatState[chatId] as string;
    }

    getOrderInfo = (chatId: number): OrderInfo => {
        if(this.orderInfos[chatId]) {
            return this.orderInfos[chatId] as OrderInfo;
        }
        this.orderInfos[chatId] = new OrderInfo();
        return this.orderInfos[chatId] as OrderInfo;
    }

    resetOrderInfo = (chatId: number) => {
        this.orderInfos[chatId] = new OrderInfo();
    }

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

    getDoc = () => this.doc;

    getReceiverBot = (): TelegramBot => this.receiverBot as TelegramBot;

    getInformatorBot = (): TelegramBot => this.informatorBot as TelegramBot;
}


export default App;