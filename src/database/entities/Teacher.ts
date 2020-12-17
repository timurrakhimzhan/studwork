import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany} from "typeorm";
import Subject from "./Subject";
import Order from "./Order";

@Entity()
export default class Teacher extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({nullable: false})
    login!: string;

    @Column({nullable: false})
    password!: string;

    @OneToMany(() => Order, (order) => order.teacher)
    orders!: Array<Order>;

    @ManyToMany(() => Subject, subject => subject.teachers, {nullable: false})
    @JoinTable()
    subjects!: Array<Subject>;
}