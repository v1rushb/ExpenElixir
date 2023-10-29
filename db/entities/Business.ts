import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users.js";

@Entity()
export class Business extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false})
  businessName: string;

  @Column()
  rootUserID: string;

  @OneToOne(() => Users, user => user.businessb, { onDelete: "CASCADE" })
  @JoinColumn()
  userb: Partial<Users>;

  @OneToMany(() => Users, user => user.business)
  users: Users[];
}