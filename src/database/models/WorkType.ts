import {Table, Model, Column, HasMany, BelongsToMany} from "sequelize-typescript";
import Subject from "./Subject";
import Order from "./Order";
import SubjectWorkType from "./SubjectWorkType";

@Table({timestamps: false})
export default class WorkType extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    workTypeId!: number;

    @Column({allowNull: false, unique: true})
    name!: string;

    @Column({defaultValue: false, allowNull: false})
    mock!: boolean;

    @HasMany(() => Order, 'workTypeId')
    orders!: Array<Order>

    @BelongsToMany(() => Subject, () => SubjectWorkType)
    subjects!: Array<Subject>
}