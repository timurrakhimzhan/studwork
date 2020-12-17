import {Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToMany, OneToMany} from 'typeorm';
import WorkTypeToSubject from "./WorkTypeToSubject";
import Teacher from "./Teacher";

@Entity()
export default class Subject extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false})
    name!: string;

    @ManyToMany(() => Teacher, teacher => teacher.subjects, {nullable: false})
    teachers!: Array<Teacher>;

    @OneToMany(() => WorkTypeToSubject, workTypeToSubject => workTypeToSubject.subject, {nullable: false})
    workTypeToSubject!: WorkTypeToSubject;
}