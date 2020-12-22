import {Table, Model, Column, HasMany, BelongsToMany} from "sequelize-typescript";
import Order from "./Order";
import WorkType from "./WorkType";
import SubjectWorkType from "./SubjectWorkType";
import Teacher from "./Teacher";
import SubjectTeacher from "./SubjectTeacher";

@Table({timestamps: false})
export default class Subject extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    subjectId!: number;

    @Column({allowNull: false, unique: true})
    name!: string;

    @Column({defaultValue: true, allowNull: false})
    visible!: boolean;

    @Column({defaultValue: false, allowNull: false})
    mock!: boolean;

    @HasMany(() => Order, 'subjectId')
    orders!: Array<Order>;

    @BelongsToMany(() => Teacher, () => SubjectTeacher)
    teachers!: Array<Teacher>;

    @BelongsToMany(() => WorkType, () => SubjectWorkType)
    workTypes!: Array<WorkType>

    SubjectWorkType?: SubjectWorkType;
}