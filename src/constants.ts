import {StatusName} from "./database/models/Status";
import {FeedbackTypeName} from "./database/models/FeedbackType";

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