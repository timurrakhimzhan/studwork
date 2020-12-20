import {Table, Model, Column, HasMany, BelongsToMany} from "sequelize-typescript";
import Order from "./Order";
import Subject from "./Subject";
import SubjectTeacher from "./SubjectTeacher";

@Table({timestamps: false})
export default class Teacher extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    teacherId!: number;

    @Column({allowNull: false})
    login!: string;

    @Column({allowNull: false})
    password!: string;

    @Column({allowNull: true})
    chatId!: number;

    @HasMany(() => Order, 'teacherId')
    orders!: Array<Order>;

    @Column({allowNull: false, defaultValue: false})
    mock!: boolean;

    @BelongsToMany(() => Subject, () => SubjectTeacher)
    subjects!: Array<Subject>;
}