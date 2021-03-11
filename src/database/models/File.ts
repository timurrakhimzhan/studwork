import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import Order from "./Order";

@Table({timestamps: false})
export default class File extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    fileId!: number;

    @Column({type: DataType.STRING, allowNull: false})
    url!: string;

    @Column({type: DataType.STRING, allowNull: true})
    receiverFileId!: string | null;

    @Column({type: DataType.STRING, allowNull: true})
    informatorFileId!: string | null;

    @HasMany(() => Order, 'assignmentFileId')
    assignmentOrders!: Array<Order>

    @HasMany(() => Order, 'solutionFileId')
    solutionOrders!: Array<Order>
}