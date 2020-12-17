import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Status extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false, unique: true})
    name!: string;
}