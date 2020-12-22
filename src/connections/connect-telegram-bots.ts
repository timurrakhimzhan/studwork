import TelegramBot from 'node-telegram-bot-api';


export function connectReceiverBot(): TelegramBot {
    const receiverToken = process.env['MOCK'] ? process.env['TG_RECEIVER_BOT_MOCK'] : process.env['TG_RECEIVER_BOT'];
    // const { receiverToken } = await readFile('./src/configs/bot-tokens.json') as {receiverToken: string};
    if(!receiverToken) {
        console.error('Receiver token is incorrect');
        process.exit(0);
    }
    return new TelegramBot(receiverToken, {polling: true})
}

export function connectInformatorBot(): TelegramBot {
    const informatorToken = process.env['MOCK'] ? process.env['TG_INFORMATOR_BOT_MOCK'] : process.env['TG_INFORMATOR_BOT'];
    // const { informatorToken } = await readFile('./src/configs/bot-tokens.json') as {informatorToken: string};
    if(!informatorToken) {
        console.error('Informator token is incorrect');
        process.exit(0);
    }
    return new TelegramBot(informatorToken, {polling: true})
}

