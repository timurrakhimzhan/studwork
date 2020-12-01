import TelegramBot from 'node-telegram-bot-api';
import fs from "fs";


export function connectReceiverBot(): Promise<TelegramBot> {
    return new Promise((resolve, reject) => {
        fs.readFile('./src/configs/bot-tokens.json', (error, content) => {
            if(error || !content) {
                console.error(`No such file ./src/configs/bot-tokens.json`);
                process.exit(0);
            }
            const credentials = JSON.parse(content.toString());
            const {receiverToken} = credentials;
            if(!receiverToken) {
                console.error(`No receiver bot token`);
                process.exit(0);
            }
            resolve(new TelegramBot(receiverToken, {polling: true}))
        });
    })
}

export function connectInformatorBot(): Promise<TelegramBot> {
    return new Promise((resolve, reject) => {
        fs.readFile('./src/configs/bot-tokens.json', (error, content) => {
            if(error || !content) {
                console.error(`No such file ./src/configs/bot-tokens.json`);
                process.exit(0);
            }
            const credentials = JSON.parse(content.toString());
            const {informatorToken} = credentials;
            if(!informatorToken) {
                console.error(`No informator bot token`);
                process.exit(0);
            }
            resolve(new TelegramBot(informatorToken, {polling: true}))
        });
    })
}



