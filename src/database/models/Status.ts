import {Table, Model, Column, HasMany} from "sequelize-typescript";
import Order from "./Order";
import {
    STATUS_FINISHED,
    STATUS_NOT_PAYED,
    STATUS_PAYED,
    STATUS_PRICE_NOT_ASSIGNED,
    STATUS_REJECTED_BY_CLIENT, STATUS_REJECTED_BY_TEACHER
} from "../../constants";

export type StatusName = 'STATUS_PRICE_NOT_ASSIGNED' | 'STATUS_NOT_PAYED' | 'STATUS_PAYED' | 'STATUS_FINISHED' |
    'STATUS_REJECTED_BY_CLIENT' | 'STATUS_REJECTED_BY_TEACHER';
export type StatusMeaning = 'Цена не установлена' | 'Не оплачено' | 'Оплачено' | 'Завершено' | 'Отменено клиентом' | 'Отменено учителем';

export const statuses: Array<StatusName> = [STATUS_PRICE_NOT_ASSIGNED, STATUS_NOT_PAYED,
    STATUS_PAYED, STATUS_FINISHED, STATUS_REJECTED_BY_CLIENT, STATUS_REJECTED_BY_TEACHER];
export const statusMeanings: Array<StatusMeaning> = ['Цена не установлена', 'Не оплачено', 'Оплачено', 'Завершено',
    'Отменено клиентом', 'Отменено учителем'];

export const statusMeaningMap: {[key in StatusName]: StatusMeaning} = {
    STATUS_PRICE_NOT_ASSIGNED: 'Цена не установлена',
    STATUS_NOT_PAYED: 'Не оплачено',
    STATUS_PAYED: 'Оплачено',
    STATUS_FINISHED: 'Завершено',
    STATUS_REJECTED_BY_CLIENT: 'Отменено клиентом',
    STATUS_REJECTED_BY_TEACHER: 'Отменено учителем',
};

@Table({timestamps: false})
export default class Status extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    statusId!: number;

    @Column({allowNull: false, unique: true})
    name!: StatusName;

    @HasMany(() => Order, 'statusId')
    orders!: Array<Order>
}