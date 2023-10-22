import { BaseEntity, BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users.js";
import { Category } from "./Category.js";


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


    @ManyToOne(() => Users, user => user.expenses)
    users: string;

    @ManyToOne(() => Category, category => category.expenses, { eager: true })
    category: Category;
}