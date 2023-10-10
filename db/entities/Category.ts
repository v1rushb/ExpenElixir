import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity } from "typeorm";
import { Expense } from "./Expense.js";
import { Users } from "./Users.js";

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column()
    description: string;

    @OneToMany(() => Expense, expense => expense.category)
    expenses: Expense[];

    @ManyToOne(() => Users, user => user.expenses)
    users: string;
}