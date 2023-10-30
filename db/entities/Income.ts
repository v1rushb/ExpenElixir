import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from "typeorm";
import { Users } from "./Users.js";
import User from "../../routers/User.js";

@Entity()
export class Income extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'double' })
    amount: number;
        
    @Column({ name: 'income_date' })
    incomeDate: Date;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Users, user => user.incomes, { onDelete: 'CASCADE' })
    user: string;

    @Column({ type: 'text', nullable: true })
    currencyData: string;
}
