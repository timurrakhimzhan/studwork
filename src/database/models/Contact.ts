import {Column, Model, Table} from "sequelize-typescript";

@Table({timestamps: false})
export default class Contact extends Model<Contact>{
    @Column({primaryKey: true, autoIncrement: true})
    contactId!: number;

    @Column({unique: true, allowNull: false})
    name!: string;

    @Column({allowNull: true})
    callback!: string;

    @Column({allowNull: true})
    url!: string;
}