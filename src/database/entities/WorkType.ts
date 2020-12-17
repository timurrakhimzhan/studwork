import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import WorkTypeToSubject from "./WorkTypeToSubject";

@Entity()
export default class WorkType extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false, unique: true})
    name!: string;

    @OneToMany(() => WorkTypeToSubject, workTypeToSubject => workTypeToSubject.subject, {nullable: false})
    workTypeToSubject!: WorkTypeToSubject;
}