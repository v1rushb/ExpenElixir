import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity } from "typeorm";
// import { Expense } from "./Expense.js";
// import { User } from "./User.js";

@Entity('Categories')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    // @OneToMany(() => Expense, expense => expense.category)
    // expenses: Expense[];

    // @ManyToOne(() => User, user => user.expenses)
    // user: User;
}