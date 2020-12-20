import Feedback from "../bot-contexts/receiver-bot/feedback";
import {GoogleSpreadsheet} from "google-spreadsheet";

export async function addFeedback(doc: GoogleSpreadsheet, chatId: number, feedback: Feedback) {
    if(!doc) {
        throw new Error('Google spreadsheet error');
    }
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[2];
    await sheet.addRow([chatId.toString(), feedback.getUserName() as string,
        feedback.getEvaluation() as string, feedback.getComment() as string]);
}

// // googleSpreadSheetController();