import TelegramBot from 'node-telegram-bot-api';


export function connectReceiverBot(): TelegramBot {
    const receiverToken = process.env['DEV'] ? process.env['TG_RECEIVER_BOT_DEV'] : process.env['TG_RECEIVER_BOT_PROD'];
    // const { receiverToken } = await readFile('./src/configs/bot-tokens.json') as {receiverToken: string};
    if(!receiverToken) {
        console.error('Receiver token is incorrect');
        process.exit(0);
    }
    return new TelegramBot(receiverToken, {polling: true})
}

export function connectInformatorBot(): TelegramBot {
    const informatorToken = process.env['DEV'] ? process.env['TG_INFORMATOR_BOT_DEV'] : process.env['TG_INFORMATOR_BOT_PROD'];
    // const { informatorToken } = await readFile('./src/configs/bot-tokens.json') as {informatorToken: string};
    if(!informatorToken) {
        console.error('Informator token is incorrect');
        process.exit(0);
    }
    return new TelegramBot(informatorToken, {polling: true})
}

