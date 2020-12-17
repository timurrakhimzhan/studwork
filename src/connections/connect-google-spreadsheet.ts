import { GoogleSpreadsheet } from 'google-spreadsheet'
import fs from 'fs';


const connectGoogleSpreadsheet = (): Promise<GoogleSpreadsheet> => {
    return new Promise((resolve, reject) => {
        const doc = new GoogleSpreadsheet(process.env['GOOGLE_SHEET_ID'] || '');
        doc.useServiceAccountAuth({
            client_email: process.env['GOOGLE_RECAPTCHA_CLIENT_EMAIL'] || '',
            private_key: process.env['GOOGLE_RECAPTCHA_PRIVATE_KEY'] || '',
        }).then((_) => {
            console.log('Connected to google sheets');
            resolve(doc);
        }).catch((err) => {
            console.error('Error connecting to google sheets');
            reject(err);
        });
    })

}

export default connectGoogleSpreadsheet;


