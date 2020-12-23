import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {FEEDBACK_BAD, FEEDBACK_GOOD, FEEDBACK_SATISFYING} from "../../constants";
import Feedback from "./Feedback";

export type FeedbackTypeName = 'FEEDBACK_GOOD' | 'FEEDBACK_SATISFYING' | 'FEEDBACK_BAD';
export const feedbackTypes: Array<FeedbackTypeName> = [FEEDBACK_GOOD, FEEDBACK_SATISFYING, FEEDBACK_BAD];

export const feedbackTypeMeaningMap = {
    FEEDBACK_GOOD: 'Отлично',
    FEEDBACK_SATISFYING: 'Удовлетворительно',
    FEEDBACK_BAD: 'Плохо'
};

@Table({timestamps: false})
export default class FeedbackType extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    feedbackTypeId!: number;

    @Column({allowNull: false, unique: true})
    name!: FeedbackTypeName;

    @HasMany(() => Feedback, 'feedbackTypeId')
    feedbacks!: Array<Feedback>;

}