import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users.js";


@Entity()
export class Profile extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255, nullable: false })
    firstName: string;

    @Column({ length: 255, nullable: false })
    lastName: string;

    @Column({ nullable: false })
    phoneNumber: string;

    @Column({ default: 'USD' })
    Currency: string;

    @Column({
        type: 'enum',
        enum: ['Member', 'Root', 'User'],
        default: 'Member'
    })
    role: string;

    @Column({ nullable: true })
    subscription_date: Date;

    @Column({ nullable: true })
    hasSentEmail: boolean;

<<<<<<< HEAD
    @OneToOne(() => Users, user => user.profile, {onDelete: 'CASCADE'})
=======
    @OneToOne(() => Users, user => user.profile, { onDelete: 'CASCADE' })
>>>>>>> cb0ba2cd9df643339156b91aebbf2ed32f3b63cd
    @JoinColumn()
    user: Partial<Users>;
}