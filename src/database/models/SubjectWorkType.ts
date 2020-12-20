import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import Subject from "./Subject";
import WorkType from "./WorkType";

@Table({timestamps: false})
export default class SubjectWorkType extends Model {
    @ForeignKey(() => Subject)
    @Column
    subjectId!: number;

    @ForeignKey(() => WorkType)
    @Column
    workTypeId!: number;

    @Column({allowNull: false})
    minPrice!: number;
}