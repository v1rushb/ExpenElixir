import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.js";

@Entity()
export class Income {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    amount: number;

    @Column({ name: 'income_date' })
    incomeDate: Date;

    @Column()
    description: string;

    @ManyToOne(() => User, user => user.incomes)
    user: User;
}
