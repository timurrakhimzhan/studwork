import {Table, Model, Column, HasMany} from "sequelize-typescript";
import Order from "./Order";

type StatusName = 'STATUS_PRICE_NOT_ASSIGNED' | 'STATUS_NOT_PAYED' | 'STATUS_PAYED' | 'STATUS_FINISHED';

@Table({timestamps: false})
export default class Status extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    statusId!: number;

    @Column({allowNull: false, unique: true})
    name!: StatusName;

    @HasMany(() => Order, 'statusId')
    orders!: Array<Order>
}