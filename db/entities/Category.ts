import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity } from "typeorm";
import { Expense } from "./Expense.js";
import { Users } from "./Users.js";

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, unique: true })
    title: string;

    @Column()
    description: string;

    @Column({ nullable: false })
    budget: number;

    @Column({ nullable: true, default: 0 })
    totalExpenses: number;

    @OneToMany(() => Expense, expense => expense.category)
    expenses: Expense[];

    @ManyToOne(() => Users, user => user.expenses, { onDelete: "CASCADE" })
    users: string;
}