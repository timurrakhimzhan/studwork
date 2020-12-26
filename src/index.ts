import App from "./App";
import dotenv from 'dotenv';
import 'reflect-metadata';
import connectDatabase from "./connections/connect-database";
import ReceiverBotContext from "./bot-contexts/receiver-bot";
import seed from "./database/utils/seed";
dotenv.config();


const initSubjectsPolling = async (botContext: ReceiverBotContext) => {
    async function poll() {
        await botContext.fetchSubjects();
        console.log('Subjects are updated', botContext.getSubjects().map((subject) => subject.name));
    }
    console.log('Subjects poll started...');
    return setInterval(poll, 60000);
}

const app = async () => {
    await connectDatabase();
    await seed();
    console.log('Database is filled');
    const app = new App();
    await app.init();
    console.log('Initialization is finished');

    await initSubjectsPolling(app.getReceiverBotContext());

    const receiverBot = app.getReceiverBotContext().getBot();
    const informatorBot = app.getInformatorBotContext().getBot();

    receiverBot.on('message', (msg) => {
        return app.getReceiverBotContext().getChatStateContext(msg.chat.id).messageController(msg);
    });
    receiverBot.on('callback_query', (cb) => {
        if(!cb.message || !cb.data) {
            return;
        }
        return app.getReceiverBotContext().getChatStateContext(cb.message?.chat.id).callbackController(cb);
    });
    receiverBot.on('pre_checkout_query', (preCq) => {
        return receiverBot.answerPreCheckoutQuery(preCq.id, true);
    })

    informatorBot.on('message', (msg) => {
        return app.getInformatorBotContext().getChatStateContext(msg.chat.id).messageController(msg);
    });

    informatorBot.on('callback_query', (cb) => {
        if(!cb.message || !cb.data) {
            return;
        }
        return app.getInformatorBotContext().getChatStateContext(cb.message?.chat.id).callbackController(cb);
    });

};

app();
