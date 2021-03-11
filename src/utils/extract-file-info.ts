import TelegramBot, {Message} from "node-telegram-bot-api";

export const extractFileInfo = async (bot: TelegramBot, message: Message): Promise<{fileId: string | null, url: string | null}> => {
    let url: string | null = null;
    let fileId: string | null = null;
    if(message.photo) {
        fileId = message.photo[message.photo.length - 1].file_id
        url = await bot.getFileLink(fileId);
    } else if(message.document) {
        fileId = message.document.file_id;
        url = await bot.getFileLink(fileId);
    }

    return {fileId, url};
}