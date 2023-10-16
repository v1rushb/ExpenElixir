import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {Users} from "./Users.js";


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

    @Column({ default: 'USD'})
    Currency: string;

    @Column({ 
        type: 'enum',
        enum: ['Member', 'Root', 'User'],
        default: 'Member'
    })
    role: string;

    @OneToOne(() => Users, user => user.profile)
    @JoinColumn()
    user: Partial<Users>;
}