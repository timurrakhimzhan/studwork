import {Table, Column, DataType, HasOne, Model, BelongsTo} from 'sequelize-typescript';
import Subject from "./Subject";
import ContactOption from "./ContactOption";
import Teacher from "./Teacher";
import Status from "./Status";
import WorkType from "./WorkType";

@Table({timestamps: true})
export default class Order extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    orderId!: number;

    @Column({allowNull: false})
    clientName!: string;

    @Column({type: DataType.TEXT, allowNull: true})
    username!: string | null;

    @Column({allowNull: false})
    chatId!: number;

    @BelongsTo(() => Subject, 'subjectId')
    subject!: Subject;

    @BelongsTo(() => WorkType, 'workTypeId')
    workType!: WorkType;

    @Column({type: DataType.TEXT, allowNull: true})
    topic!: string | null;

    @Column({allowNull: false})
    phone!: string;

    @Column({allowNull: false})
    email!: string;

    @BelongsTo(() => ContactOption, 'contactOptionId')
    contactOption!: ContactOption;

    @Column({type: DataType.DATE, allowNull: false})
    datetime!: Date;

    @Column({allowNull: false})
    comment!: string;

    @Column({type: DataType.TEXT, allowNull: true})
    fileLink!: string | null;

    @Column({type: DataType.INTEGER, allowNull: true})
    price!: number;

    @Column({type: DataType.TEXT, allowNull: true})
    teacherComment!: string;

    @Column({allowNull: false, defaultValue: false})
    mock!: boolean;

    @BelongsTo(() => Teacher, 'teacherId')
    teacher!: Teacher | null;

    @BelongsTo(() => Status, 'statusId')
    status!: Status;
}