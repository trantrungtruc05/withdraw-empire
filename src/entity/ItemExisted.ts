import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "items_existed",
})
export class ItemExisted extends Model {

    @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true})
    id!: string;

    @Column({ type: DataType.STRING, allowNull: true})
    name: string;
}