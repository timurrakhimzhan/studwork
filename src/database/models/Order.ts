import {Table, Column, DataType, HasOne, Model, BelongsTo} from 'sequelize-typescript';
import Subject from "./Subject";
import ContactOption from "./ContactOption";
import Teacher from "./Teacher";
import Status from "./Status";
import WorkType from "./WorkType";
import File from "./File";
import {Col} from "sequelize/types/lib/utils";

@Table({timestamps: false})
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

    @Column({type: DataType.DATE, allowNull: false})
    creationDate!: Date;

    @Column({type: DataType.DATE, allowNull: true})
    paymentDate!: Date | null;

    @Column({allowNull: false})
    comment!: string;

    @BelongsTo(() => File, 'assignmentFileId')
    assignmentFile!: File | null;

    @Column({type: DataType.INTEGER, allowNull: true})
    price!: number | null;

    @Column({type: DataType.TEXT, allowNull: true})
    priceComment!: string | null;

    @BelongsTo(() => File, 'solutionFileId')
    solutionFile!: File | null;

    @Column({type: DataType.TEXT, allowNull: true})
    solutionComment!: string | null;

    @Column({type: DataType.TEXT, allowNull: true})
    rejectionClientReason!: string | null;

    @Column({type: DataType.TEXT, allowNull: true})
    rejectionTeacherReason!: string | null;

    @Column({allowNull: false, defaultValue: false})
    mock!: boolean;

    @BelongsTo(() => Teacher, 'teacherId')
    teacher!: Teacher | null;

    @BelongsTo(() => Status, 'statusId')
    status!: Status;
}