import {BelongsTo, Column, DataType, Model, Table} from "sequelize-typescript";
import FeedbackType from "./FeedbackType";

@Table({timestamps: true})
export default class Feedback extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    feedbackId!: number;

    @Column({type: DataType.TEXT, allowNull: true})
    username!: string | null;

    @Column({allowNull: false})
    chatId!: number;

    @BelongsTo(() => FeedbackType, 'feedbackTypeId')
    feedbackType!: FeedbackType

    @Column({allowNull: false})
    comment!: string

    @Column({allowNull: false, defaultValue: false})
    mock!: boolean;
}