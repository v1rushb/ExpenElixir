import {BaseEntity, BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
// import { User } from "./User.js";
// import { Category } from "./Category.js";


@Entity('Expenses')
export class Expense extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;
    
    @Column()
    amount : number;

    @Column()
    expenseDate : Date;

    @Column({length: 255})
    description : string;

    @Column({ name: 'pictureURL' })
    picURL: string;


    // @ManyToOne(() => User, user => user.expenses)
    // user: User;

    // @ManyToOne(() => Category, category => category.expenses)
    // category: Category;
}