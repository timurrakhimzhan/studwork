import {Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import Subject from "./Subject";
import Teacher from "./Teacher";

@Table({timestamps: false})
export default class SubjectTeacher extends Model {
    @ForeignKey(() => Subject)
    @Column
    subjectId!: number;

    // @HasMany(() => Subject, 'subjectId')
    // subjects!: Array<Subject>

    @ForeignKey(() => Teacher)
    @Column
    teacherId!: number;

    // @HasMany(() => Teacher, 'teacherId')
    // teachers!: Array<Teacher>


}