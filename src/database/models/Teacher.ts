import {Table, Model, Column, HasMany, BelongsToMany, DataType} from "sequelize-typescript";
import Order from "./Order";
import Subject from "./Subject";
import SubjectTeacher from "./SubjectTeacher";

@Table({timestamps: false})
export default class Teacher extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    teacherId!: number;

    @Column({allowNull: false, unique: true})
    login!: string;

    @Column({allowNull: false})
    password!: string;

    @Column({type: DataType.INTEGER,allowNull: true})
    chatId!: number | null;

    @Column({allowNull: false, defaultValue: false})
    isAdmin!: boolean;

    @Column({allowNull: false})
    name!: string;

    @Column({type: DataType.STRING, allowNull: true})
    userName!: string | null;

    @HasMany(() => Order, 'teacherId')
    orders!: Array<Order>;

    @Column({allowNull: false, defaultValue: false})
    mock!: boolean;

    @BelongsToMany(() => Subject, () => SubjectTeacher)
    subjects!: Array<Subject>;
}