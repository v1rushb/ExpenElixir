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

<<<<<<< HEAD
    @Column({ nullable: false })
    budget: number;

    @Column({nullable: true, default: 0})
    totalExpenses: number;

    @OneToMany(() => Expense, expense => expense.category)
=======
    @OneToMany(() => Expense, expense => expense.category, { onDelete: "CASCADE" })
>>>>>>> cb0ba2cd9df643339156b91aebbf2ed32f3b63cd
    expenses: Expense[];

    @ManyToOne(() => Users, user => user.expenses, { onDelete: "CASCADE" })
    users: string;
}