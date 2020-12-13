import express from 'express';
import {readFile, writeFile} from "../utils/io";
import bodyParser from "body-parser";
import path from 'path';

export default function runServer() {
    const server = express();
    server.use(bodyParser.json())

    server.get('/', (req, res) => {
        res.sendFile(path.join(process.cwd(), './src/server/index.html'));
    });

    server.post('/api/changePaymentToken', async (req, res) => {
        if(!req.body) {
            return res.status(400).send('Do not hack me');
        }
        const { newPaymentToken, password } = req.body as {newPaymentToken: string, password: string};
        if(!newPaymentToken || !password) {
            return res.status(400).send('Do not hack me');
        }
        const {secretWord} = await readFile('./src/configs/app-configs.json') as {secretWord: string};

        if(secretWord !== password) {
            return res.status(401).send('Неправильный пароль');
        }
        const configData = await readFile('./src/configs/bot-tokens.json') as {paymentToken: string};
        configData.paymentToken = newPaymentToken;
        await writeFile('./src/configs/bot-tokens.json', JSON.stringify(configData));
        process.env['paymentToken'] = newPaymentToken;
        res.send('Токен успешно изменен');
    });

    server.listen(3000);
}

