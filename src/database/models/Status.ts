import {Table, Model, Column, HasMany} from "sequelize-typescript";
import Order from "./Order";

export type StatusName = 'STATUS_PRICE_NOT_ASSIGNED' | 'STATUS_NOT_PAYED' | 'STATUS_PAYED' | 'STATUS_FINISHED';
export type StatusMeaning = 'Цена не установлена' | 'Не оплачено' | 'Оплачено' | 'Завершено';

export const statuses: Array<StatusName> = ['STATUS_PRICE_NOT_ASSIGNED', 'STATUS_NOT_PAYED', 'STATUS_PAYED', 'STATUS_FINISHED'];
export const statusMeanings: Array<StatusMeaning> = ['Цена не установлена', 'Не оплачено', 'Оплачено', 'Завершено'];

export const statusMeaningMap: {[key in StatusName]: StatusMeaning} = {
    'STATUS_PRICE_NOT_ASSIGNED': 'Цена не установлена',
    'STATUS_NOT_PAYED': 'Не оплачено',
    'STATUS_PAYED': 'Оплачено',
    'STATUS_FINISHED': 'Завершено'
}

@Table({timestamps: false})
export default class Status extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    statusId!: number;

    @Column({allowNull: false, unique: true})
    name!: StatusName;

    @HasMany(() => Order, 'statusId')
    orders!: Array<Order>
}