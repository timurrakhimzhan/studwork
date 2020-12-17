import {BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import Subject from "./Subject";
import ContactOptions from "./ContactOptions";
import Teacher from "./Teacher";
import Status from "./Status";

@Entity()
export default class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false})
    name!: string;

    @Column({nullable: false})
    username!: string;

    @ManyToOne(() => Subject, {nullable: false})
    subject!: Subject;

    @Column({nullable: true})
    topic!: string;

    @Column({nullable: false})
    phone!: string;

    @Column({nullable: false})
    email!: string;

    @ManyToOne(() => Subject, {nullable: false})
    contactOption!: ContactOptions;

    @Column({type: 'timestamp',nullable: false})
    datetime!: Date;

    @Column({nullable: false})
    comment!: string;

    @Column({nullable: true})
    fileLink!: string;

    @Column({nullable: true})
    price!: number;

    @Column({nullable: true})
    teacherComment!: string;

    @ManyToOne(() => Teacher, teacher => teacher.orders, {nullable: true})
    teacher!: Teacher;

    @ManyToOne(() => Status)
    status!: Status;
}