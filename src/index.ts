import {getSubjectsInfo} from "./controllers/google-spreadsheet-controller";
import App from "./App";
import {
    CHOOSE_CONTACT_OPTION,
    CHOOSE_SUBJECT, COMMENT_INPUT, CONTACTS, DATE_INPUT,
    EMAIL_INPUT, FEEDBACK_COMMENT, FEEDBACK_EVALUATE,
    MAIN_MENU,
    NAME_INPUT, PAYMENT,
    PHONE_INPUT,
    UPLOAD_FILE
} from "./states";
import {receiverSendMessage} from "./controllers/telegram-bot-controllers";
import {
    mainMenuCallbackController,
    mainMenuMessageController
} from "./controllers/state-controllers/main-menu-controller";
import {nameInputMessageController} from "./controllers/state-controllers/order-controllers/name-input-controller";
import {chooseSubjectCallbackController} from "./controllers/state-controllers/order-controllers/choose-subject-controller";
import {uploadFileMessageController} from "./controllers/state-controllers/order-controllers/upload-file-controller";
import {phoneInputMessageController} from "./controllers/state-controllers/order-controllers/phone-input-controller";
import {emailInputMessageController} from "./controllers/state-controllers/order-controllers/email-input-controller";
import {chooseContactOptionCallbackController} from "./controllers/state-controllers/order-controllers/choose-contact-option-controller";
import {dateInputMessageController} from "./controllers/state-controllers/order-controllers/date-input-controller";
import {commentInputMessageController} from "./controllers/state-controllers/order-controllers/comment-input-controller";
import {paymentMessageController} from "./controllers/state-controllers/order-controllers/payment-message-controller";
import {feedbackCommentMessageController} from "./controllers/state-controllers/feedback-comment-controller";


const initPolling = async () => {
    async function poll() {
        const subjects = await getSubjectsInfo();
        App.getInstance().setSubjects(subjects);
        console.log('Предметы загружены', subjects);
    }
    await poll();
    return setInterval(poll, 60000);
}

const informatorChatId = 317143449;

const app = async () => {
    const app = App.getInstance();
    await app.init();
    await initPolling();
    const receiverBot = app.getReceiverBot();

    receiverBot.on('message', async (msg) => {
        const state = app.getChatState(msg.chat.id);
        if(msg.text?.trim() === 'Вернуться в меню') {
            app.setChatState(msg.chat.id, MAIN_MENU);
            await receiverSendMessage(msg.chat.id, 'Выберите интересующую вас тему:');
            return;
        }
        if(msg.text?.trim() === '/start') {
            app.setChatState(msg.chat.id, MAIN_MENU);
            app.setFeedbackGiven(msg.chat.id, false);
            app.resetFeedback(msg.chat.id);
            app.resetOrderInfo(msg.chat.id);
            await receiverSendMessage(msg.chat.id, 'Добрый день! Вас приветствует компания StudWork!')
            await receiverSendMessage(msg.chat.id, 'Выберите интересующую вас тему:');
            return;
        }
        if(state === MAIN_MENU) {
            await mainMenuMessageController(receiverBot, msg);
        }
        if(state === NAME_INPUT) {
            await nameInputMessageController(receiverBot, msg);
        }
        if(state === UPLOAD_FILE) {
            await uploadFileMessageController(receiverBot, msg);
        }
        if(state === PHONE_INPUT) {
            await phoneInputMessageController(receiverBot, msg);
        }
        if(state === EMAIL_INPUT) {
            await emailInputMessageController(receiverBot, msg);
        }
        if(state === DATE_INPUT) {
            await dateInputMessageController(receiverBot, msg);
        }
        if(state === COMMENT_INPUT) {
            await commentInputMessageController(receiverBot, msg);
        }
        if(state === PAYMENT) {
            await paymentMessageController(receiverBot, msg);
        }
        if(state === FEEDBACK_COMMENT) {
            await feedbackCommentMessageController(receiverBot, msg);
        }
    });
    receiverBot.on('callback_query', async (cb) => {
        if(!cb.message || !cb.data) {
            return;
        }
        const state = app.getChatState(cb.message?.chat.id || 0);
        if(state === MAIN_MENU) {
            await mainMenuCallbackController(receiverBot, cb);
        }
        if(state === CHOOSE_SUBJECT) {
           await chooseSubjectCallbackController(receiverBot, cb);
        }
        if(state === CHOOSE_CONTACT_OPTION) {
            await chooseContactOptionCallbackController(receiverBot, cb);
        }
    });
    receiverBot.on('pre_checkout_query', async (preCheckoutQuery) => {
        await receiverBot.answerPreCheckoutQuery(preCheckoutQuery.id, true);
    });
    app.getInformatorBot().on('message', msg => {
        console.log(msg.chat.id, 'chatt');
    })
};

app();
