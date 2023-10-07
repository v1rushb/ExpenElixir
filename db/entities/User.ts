import {BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import bcrypt from 'bcrypt';
import { Expense } from "./Expense.js";
import { Income } from "./Income.js";
import { Category } from "./Category.js";


@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255, nullable: false })
        firstName: string;

    @Column({ length: 255, nullable: false })
        lastName: string;
    
    @Column({ length: 255, nullable: false, unique: true})
    username: string;

    @Column({ nullable: false ,unique: true})
    email: string;

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10)
        }
    }
    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
        phoneNumber : string;

    
    @OneToMany(() => Expense, expense => expense.user)
    expenses: Expense[];
    
    @OneToMany(() => Category, category => category.user)
    categories: Category[];
    
    @OneToMany(() => Income, income => income.user)
    incomes: Income[];

}