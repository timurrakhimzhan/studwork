import TelegramBot from 'node-telegram-bot-api';
import fs from "fs";


export function connectReceiverBot(): Promise<TelegramBot> {
    return new Promise((resolve, reject) => {
        fs.readFile('./src/configs/bot-tokens.json', (error, content) => {
            if(error) {
                reject(error)
            }
            const credentials = JSON.parse(content.toString());
            const {receiverToken} = credentials;
            resolve(new TelegramBot(receiverToken, {polling: true}))
        });
    })
}

export function connectInformatorBot(): Promise<TelegramBot> {
    return new Promise((resolve, reject) => {
        fs.readFile('./src/configs/bot-tokens.json', (error, content) => {
            if(error) {
                reject(error)
            }
            const credentials = JSON.parse(content.toString());
            const {informatorToken} = credentials;
            resolve(new TelegramBot(informatorToken, {polling: true}))
        });
    })
}



