import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Subject from "./Subject";
import WorkType from "./WorkType";

@Entity()
export default class WorkTypeToSubject extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false})
    minPrice!: number;

    @ManyToOne(() => Subject, subject => subject.workTypeToSubject, {nullable: false})
    subject!: Subject;

    @ManyToOne(() => WorkType, workType => workType.workTypeToSubject, {nullable: false})
    workType!: Subject;
}