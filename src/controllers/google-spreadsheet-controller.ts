import {GoogleSpreadsheet} from "google-spreadsheet";
import OrderInfo from "../OrderInfo";
import App from "../App";
import Feedback from "../Feedback";

export async function getSubjectsInfo(): Promise<Array<ISubject>> {
    const doc = App.getInstance().getDoc();
    if(!doc) {
        throw new Error('Google spreadsheet error');
    }
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    return (await sheet.getRows()).map((subject) => ({
        name: subject['Предмет'],
        price: subject['Цена'],
    }));
}

export async function addOrder(order: OrderInfo) {
    const doc = App.getInstance().getDoc();
    if(!doc) {
        throw new Error('Google spreadsheet error');
    }
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow([order.getName() as string, order.getUserName() as string,
        order.getSubject()?.name as string, order.getSubject()?.price as string,
        order.getPhone() as string, order.getEmail() as string,
        order.getContactOption() as string, order.getDate() as string,
        order.getComment() as string, order.getUrl() as string]);
}

export async function addFeedback(chatId: number, feedback: Feedback) {
    const doc = App.getInstance().getDoc();
    if(!doc) {
        throw new Error('Google spreadsheet error');
    }
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[2];
    await sheet.addRow([chatId.toString(), feedback.getUserName() as string,
        feedback.getEvaluation() as string, feedback.getComment() as string]);
}

// // googleSpreadSheetController();