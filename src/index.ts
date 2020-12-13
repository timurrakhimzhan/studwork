import {getSubjectsInfo} from "./controllers/google-spreadsheet-controller";
import App from "./App";
import runServer from "./server";


const initPolling = async (app: App) => {
    async function poll() {
        const subjects = await getSubjectsInfo(app.getDoc());
        app.setSubjects(subjects);
        console.log('Предметы загружены', subjects);
    }
    await poll();
    return setInterval(poll, 60000);
}

const app = async () => {
    runServer();
    const app = new App();
    await app.init();
    await initPolling(app);
    const receiverBot = app.getReceiverBot();

    receiverBot.on('message', (msg) => {
        return app.getChatStateContext(msg.chat.id).messageController(msg);
    });
    receiverBot.on('callback_query', (cb) => {
        if(!cb.message || !cb.data) {
            return;
        }
        return app.getChatStateContext(cb.message?.chat.id).callbackController(cb);
    });
    receiverBot.on('pre_checkout_query', (preCq) => {
        return receiverBot.answerPreCheckoutQuery(preCq.id, true);
    })

};

app();
