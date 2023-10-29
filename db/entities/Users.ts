import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from 'bcrypt';
import { Expense } from "./Expense.js";
import { Income } from "./Income.js";
import { Category } from "./Category.js";
import { Profile } from "./Profile.js";
import { Business } from "./Business.js";


@Entity()

export class Users extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255, nullable: false, unique: true })
    username: string;

    @Column({ nullable: false })
    email: string;

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    iamId: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    verificationToken: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    resetToken: string;

    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpiration?: Date;

    @Column({ nullable: true })
    newHashedPassword?: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP(6)"
    })
    createdAt: Date;

    @OneToMany(() => Expense, expense => expense.users, { cascade: true })
    expenses: Expense[];

    @OneToMany(() => Category, category => category.users, { cascade: true })
    categories: Category[];

    @OneToMany(() => Income, income => income.user, { cascade: true })
    incomes: Income[];

    @ManyToOne(() => Business, business => business.users)
    business: Business;

    @OneToOne(() => Profile, profile => profile.user, { eager: true, cascade: true })
    profile: Partial<Profile>;

}