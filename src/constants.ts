import {StatusName} from "./database/models/Status";
import {FeedbackTypeName} from "./database/models/FeedbackType";

type Currency = {
    label: string;
    code: string;
}

export const CURRENCY: Currency = {
    label: 'руб',
    code: 'RUB',
};


export const URL_WHATSAPP = 'https://wa.me/77756818268';
export const URL_TELEGRAM = 'https://t.me/StudWorkk';

export const CALLBACK_PHONE_OPTION = 'CALLBACK_PHONE_OPTION';
export const CALLBACK_EMAIL_OPTION = 'CALLBACK_EMAIL_OPTION';
export const CALLBACK_TELEGRAM_OPTION = 'CALLBACK_TELEGRAM_OPTION';

export const CALLBACK_PHONE_CALL = 'CALLBACK_PHONE_CALL'

export const CALLBACK_CLIENT_FILE = 'CALLBACK_CLIENT_FILE';
export const CALLBACK_CLIENT_REJECT = 'CALLBACK_CLIENT_REJECT';
export const CALLBACK_TEACHER_REJECT = 'CALLBACK_TEACHER_REJECT';
export const CALLBACK_SET_PRICE = 'CALLBACK_SET_PRICE';
export const CALLBACK_PAY = 'CALLBACK_PAY';
export const CALLBACK_UPLOAD_SOLUTION = 'CALLBACK_UPLOAD_SOLUTION';
export const CALLBACK_TEACHER_FILE = 'CALLBACK_TEACHER_FILE';

export const CALLBACK_ITEM_BACK = 'CALLBACK_ITEM_BACK'
export const CALLBACK_ITEM_NEXT = 'CALLBACK_ITEM_NEXT'


export const FEEDBACK_GOOD: FeedbackTypeName = 'FEEDBACK_GOOD';
export const FEEDBACK_SATISFYING: FeedbackTypeName = 'FEEDBACK_SATISFYING';
export const FEEDBACK_BAD: FeedbackTypeName = 'FEEDBACK_BAD';

export const STATUS_PRICE_NOT_ASSIGNED: StatusName = 'STATUS_PRICE_NOT_ASSIGNED';
export const STATUS_NOT_PAYED: StatusName = 'STATUS_NOT_PAYED';
export const STATUS_PAYED: StatusName = 'STATUS_PAYED';
export const STATUS_FINISHED: StatusName = 'STATUS_FINISHED';
export const STATUS_REJECTED_BY_CLIENT: StatusName = 'STATUS_REJECTED_BY_CLIENT';
export const STATUS_REJECTED_BY_TEACHER: StatusName = 'STATUS_REJECTED_BY_TEACHER';

export const ERROR_WRONG_CREDENTIALS = 'ERROR_WRONG_CREDENTIALS';
export const ERROR_TOO_MANY_ATTEMPTS = 'ERROR_TOO_MANY_ATTEMPTS';