import { BaseEntity, BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users.js";
import { Category } from "./Category.js";
import { Gen } from "../../@types/generic.js";

@Entity()
export class Expense extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'double' })
    amount: number;

    @Column()
    expenseDate: Date;

    @Column({ length: 255 })
    description: string;

    @Column({ name: 'pictureURL', default: 'http://default' })
    picURL: string;

    @Column({ type: 'json', nullable: true })
    data: Gen.currencyType;

    @ManyToOne(() => Users, user => user.expenses, { onDelete: "CASCADE" })
    users: string;

    @ManyToOne(() => Category, category => category.expenses, { eager: true, onDelete: "CASCADE" })
    category: Category;
}
