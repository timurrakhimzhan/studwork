import TelegramBot from 'node-telegram-bot-api';
import {readFile} from "../utils/io";


export function connectReceiverBot(): TelegramBot {
    const receiverToken: string = process.env['TG_RECEIVER_BOT'] as string;
    // const { receiverToken } = await readFile('./src/configs/bot-tokens.json') as {receiverToken: string};
    if(!receiverToken) {
        console.error('Receiver token is incorrect');
        process.exit(0);
    }
    return new TelegramBot(receiverToken, {polling: true})
}

export function connectInformatorBot(): TelegramBot {
    const informatorToken: string = process.env['TG_INFORMATOR_BOT'] as string;
    // const { informatorToken } = await readFile('./src/configs/bot-tokens.json') as {informatorToken: string};
    if(!informatorToken) {
        console.error('Informator token is incorrect');
        process.exit(0);
    }
    return new TelegramBot(informatorToken, {polling: true})
}

export async function connectPayment(): Promise<void> {
    try {
        const { paymentToken } = await readFile('./src/configs/bot-tokens.json') as {paymentToken: string};
        if(!paymentToken) {
            console.error('Payment token is incorrect');
            process.exit(0);
        }
        process.env['paymentToken'] = paymentToken;
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}

