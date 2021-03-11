import {InlineKeyboardButton, KeyboardButton} from "node-telegram-bot-api";
import Subject from "../database/models/Subject";
import axios from "axios";
import Order from "../database/models/Order";
import moment from "moment";
import {
    CURRENCY,
    STATUS_FINISHED,
    STATUS_NOT_PAYED,
    STATUS_PRICE_NOT_ASSIGNED,
    STATUS_REJECTED_BY_CLIENT,
    STATUS_REJECTED_BY_TEACHER
} from "../constants";
import {statusMeaningMap} from "../database/models/Status";
import Feedback from "../database/models/Feedback";
import {feedbackTypeMeaningMap} from "../database/models/FeedbackType";
import {or} from "sequelize";

export const generateSubjectsMessage = (subjects: Array<Subject>) => {
    return `Список доступных предметов:\n${subjects.map(subject => '• ' + subject.name).join('\n')}`;
}

export const generatePriceList = (subject: Subject) => {
    return `Прайс-лист (сумма может оказаться выше, в зависимости от трудоемкости и сложности заданий):\n${subject.workTypes.map(workType => 
        `${workType.name}: *${workType.SubjectWorkType?.minPrice}${CURRENCY.label}*`).join('\n')}`
}

export const generateInlineMenu = (menuItems: Array<{name: string; callback?: string | null; url?: string | null}>): Array<Array<InlineKeyboardButton>> =>{
    const markup: Array<Array<InlineKeyboardButton>> = [];

    const buttons: Array<InlineKeyboardButton> = menuItems.map(menuItem => {
        if(menuItem.url) {
            return {text: menuItem.name, url: menuItem.url};
        }
        if(menuItem.callback) {
            return {text: menuItem.name, callback_data: menuItem.callback};
        }
        return ({text: menuItem.name, callback_data: menuItem.name});
    });
    while(buttons.length) {
        markup.push(buttons.splice(0, 2));
    }
    return markup;
}

export const generateKeyboardMenu = (menuItems: Array<{name: string}>): Array<Array<KeyboardButton>> => {
    const markup: Array<Array<KeyboardButton>> = [];
    const buttons: Array<KeyboardButton> = menuItems.map(menuItem => ({text: menuItem.name}));
    while(buttons.length) {
        markup.push(buttons.splice(0, 2));
    }
    return markup;
}

export const getBufferFromUrl = async(url: string): Promise<Buffer> => {
    const response = await axios.get(url, {responseType: 'arraybuffer'});
    return Buffer.from(response.data, 'binary');
}

export const generateReceipt = (order: Order, isTeacher: boolean = false, isAdmin: boolean = false) => {
    const userName = order.username ? '@' + order.username : '*Юзернейм не указан*';
    const formatter =  Intl.DateTimeFormat(['ru-RU'], {day: 'numeric', month: 'long', year: 'numeric'});
    const date = formatter.format(order.datetime);
    const time = moment(order.datetime).format('HH:mm');
    const creationDate = formatter.format(order.creationDate);
    const paymentDate = order.paymentDate ? formatter.format(order.paymentDate) : null;
    const subject = order.workType.subjects.find((subject) => subject.name === order.subject.name);
    const minPrice = subject?.SubjectWorkType?.minPrice || 'Не указано';
    let extraInfo = '';
    if(order.status.name === STATUS_REJECTED_BY_CLIENT) {
        extraInfo = extraInfo + ` \n` +
            `Причина отмены заказа: *${order.rejectionClientReason}*`;
    }
    if(order.status.name === STATUS_REJECTED_BY_TEACHER) {
        extraInfo = extraInfo + ` \n` +
            `Причина отмены заказа: *${order.rejectionTeacherReason}*`;
    }
    if(order.status.name === STATUS_NOT_PAYED) {
        extraInfo = extraInfo + ` \n` +
            `Цена: *${order.price}* \n` +
            `Комментарий к цене: *${order.priceComment}*`;
    }
    if(order.status.name === STATUS_FINISHED) {
        extraInfo = extraInfo + ` \n` +
            `Цена: *${order.price}${CURRENCY.label}* \n` +
            `Комментарий к цене: *${order.priceComment}* \n` +
            `Комментарий к выполненному заданию: *${order.solutionComment}*`
    }
    if(isAdmin) {
        extraInfo = extraInfo + ` \n` +
            `Имя учителя: *${order.teacher ? order.teacher.name : 'Не указано'}* \n` +
            `Юзернейм учителя: *${order.teacher?.userName ? '@' + order.teacher.userName : 'Не указано'}* \n`;
    }
    return `*Заказ #${order.orderId}* \n` +
        `Имя клиента: *${order.clientName}* \n` +
        `Дата совершение заказа: *${creationDate}* \n` +
        `Юзернейм клиента: ${userName} \n` +
        `Предмет: *${order.subject.name}* \n` +
        `Тип работы: *${order.workType.name}*\n` +
        `Цена в прайс-листе: *${minPrice}${CURRENCY.label}*\n` +
        `Тема работы: *${order.topic || 'Тема не указана'}*\n` +
        `Файл: *${order.assignmentFile ? 'Прикреплен' : 'Не прикреплен'}*\n` +
        `Комментарий клиента: *${order.comment}* \n` +
        `Дата сдачи: *${date}* \n` +
        `Время сдачи: *${time}* \n` +
        (paymentDate ? `Дата оплаты: *${paymentDate}* \n` : '') +
        (isAdmin || !isTeacher ? `Телефон клиента: *${order.phone}* \n` : '') +
        (isAdmin || !isTeacher ? `Почта клиента: *${order.email}* \n` : '') +
        (isAdmin || !isTeacher ? `Как связаться: *${order.contactOption.name}* \n` : '') +
        `Статус заказа: *${statusMeaningMap[order.status.name]}*` + extraInfo;
}

export const generateFeedbackInfo = (feedback: Feedback) => {
    const userName = feedback.username ? '@' + feedback.username : '*Юзернейм не указан*';
    return `*Отзыв #${feedback.feedbackId}* \n` +
        `Юзернейм клиента: ${userName} \n` +
        `Оценка: *${feedbackTypeMeaningMap[feedback.feedbackType.name]}* \n` +
        `Комментарий: *${feedback.comment}*`;
}

export const generateTeacherNotification = (order: Order, isAdmin: boolean = false) => {
    let lastLine = `Для более подробной информации, выберите статус заказа: *${statusMeaningMap[order.status.name]}*`;
    if(isAdmin) {
        lastLine = lastLine + `\n` +
            `Учитель: *${order.teacher?.name || 'Имя не указано'}*`;
    }
    if(order.status.name === STATUS_PRICE_NOT_ASSIGNED) {
        const formatter =  Intl.DateTimeFormat(['ru-RU'], {day: 'numeric', month: 'long', year: 'numeric'});
        return `*Новый заказ!* \n` +
            `*Заказ #${order.orderId}* \n` +
            `Дата выполнения: *${formatter.format(order.datetime)}* \n` +
            `Время выполнения: *${moment(order.datetime).format('HH:mm')}* \n` + lastLine
    }
    return `*Обновился статус заказа #${order.orderId}* \n` + lastLine;
}

export const generateClientNotification = (order: Order) => {
    const lastLine = `Для более подробной информации, выберите статус заказа: *${statusMeaningMap[order.status.name]}*`;
    if(order.status.name === STATUS_REJECTED_BY_TEACHER) {
        return `*Учитель отменил ваш заказ!* \n` +
            `*Заказ #${order.orderId}* \n` +
            `Причина отмены: *${order.rejectionTeacherReason}* \n` + lastLine;
    }
    if(order.status.name === STATUS_NOT_PAYED) {
        return `*Учитель установил цену вашего заказа!* \n` +
            `*Заказ #${order.orderId}* \n` +
            `Цена: *${order.price}${CURRENCY.label}* \n` + lastLine;
    }
    if(order.status.name === STATUS_FINISHED) {
        return `*Учитель выполнил ваш заказ!* \n` +
            `*Заказ #${order.orderId}* \n` +
            `Цена: *${order.price}* \n`
            + lastLine + `\n` +
            `*Спасибо за пользование услугами нашего сервиса!*`;
    }
    return `*Обновился статус заказа #${order.orderId}* \n` + lastLine;
};