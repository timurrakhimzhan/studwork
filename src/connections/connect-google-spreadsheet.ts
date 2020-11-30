import { GoogleSpreadsheet } from 'google-spreadsheet'
import fs from 'fs';


const connectGoogleSpreadsheet = (): Promise<GoogleSpreadsheet> => {
    return new Promise((resolve, reject) => {
        const doc = new GoogleSpreadsheet('1HcwfFOFa_oxpa46PH4CrYu_q854HyAOCjeIoxGqtdvM');
        fs.readFile('./src/configs/google-sheets-configs.json', (_, content) => {
            const credentials = JSON.parse(content.toString());
            doc.useServiceAccountAuth({
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            }).then((_) => {
                console.log('Connected to google sheets');
                resolve(doc);
            }).catch((err) => {
                console.error('Error connecting to google sheets');
                reject(err);
            });
        });
    })

}

export default connectGoogleSpreadsheet;


