import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users.js";

@Entity()
export class Business extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  businessName: string;

  @Column()
  rootUserID: string;

  @OneToMany(() => Users, user => user.business, { onDelete: "CASCADE" })
  users: Users[];
}