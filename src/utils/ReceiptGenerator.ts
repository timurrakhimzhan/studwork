import moment from "moment";
import Order from "../database/models/Order";

export default class ReceiptGenerator {
    public static generateReceiptForClient = (order: Order) => {
        const date = moment(order.datetime).format('DD-MM-YYYY');
        const time = moment(order.datetime).format('HH:mm');
        return `Вас зовут: *${order.clientName}* \n` +
            `Предмет: *${order.subject.name}* \n` +
            `Тема работы: *${order.workType.name || 'Тема не указана'}*\n` +
            `Файл: *${order.fileLink ? 'Прикреплен' : 'Не прикреплен'}*\n` +
            `Ваш комментарий: *${order.comment}* \n` +
            `Дата сдачи: *${date}* \n` +
            `Время: *${time}* \n` +
            `Ваш телефон: *${order.phone}* \n` +
            `Ваша почта: *${order.email}* \n` +
            `Как связаться: *${order.contactOption.name}*`;
    }

    public static getReceiptForTeacher = (order: Order) => {
        const userName = order.username ? '@' + order.username : '*Юзернейм не указан*';
        const date = moment(order.datetime).format('DD-MM-YYYY');
        const time = moment(order.datetime).format('HH:mm');
        return `Имя клиента: *${order.clientName}* \n` +
            `Юзернейм клиента: ${userName} \n` +
            `Предмет: *${order.subject.name}* \n` +
            `Тема работы: *${order.workType.name || 'Тема не указана'}*\n` +
            `Файл: *${order.fileLink ? 'Прикреплен' : 'Не прикреплен'}*\n` +
            `Комментарий клиента: *${order.comment}* \n` +
            `Дата сдачи: *${date}* \n` +
            `Время: *${time}* \n` +
            `Телефон клиента: *${order.phone}* \n` +
            `Почта клиента: *${order.email}* \n` +
            `Как связаться: *${order.contactOption.name}*`;
    }
}