import App from "../App";

export async function informatorSendMessage(app: App, reply: string) {
    const bot = app.getInformatorBot();
    const informatorChatIds = [317143449, 504600826];
    for(let chatId of informatorChatIds) {
        await bot.sendMessage(chatId, reply, {parse_mode: 'Markdown'});
    }
}

export async function informatorSendDocument(app: App, doc: Buffer) {
    const bot = app.getInformatorBot();
    const informatorChatIds = [317143449, 504600826];
    for(let chatId of informatorChatIds) {
        await bot.sendDocument(chatId, doc);
    }
}