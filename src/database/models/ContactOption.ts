import {Table, Column, BelongsToMany, Model, DataType, BelongsTo, HasMany} from "sequelize-typescript";
import Order from "./Order";

@Table({timestamps: false})
export default class ContactOption extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    contactOptionId!: number;

    @Column({allowNull: false, unique: true})
    name!: string;

    @Column({allowNull: true, type: DataType.TEXT})
    callback!: string | null;

    @Column({allowNull: true, type: DataType.TEXT})
    url!: string;

    @HasMany(() => Order, 'contactOptionId')
    orders!: Array<Order>;
}