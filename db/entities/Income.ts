import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from "typeorm";
import { Users } from "./Users.js";
import User from "../../routers/User.js";

@Entity()
export class Income extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    amount: number;

    @Column({ name: 'income_date' })
    incomeDate: Date;

    @Column()
    description: string;

    @ManyToOne(() => Users, user => user.incomes)
    user: string;
}
