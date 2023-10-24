var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseEntity, BeforeInsert, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from 'bcrypt';
import { Expense } from "./Expense.js";
import { Income } from "./Income.js";
import { Category } from "./Category.js";
import { Profile } from "./Profile.js";
import { Business } from "./Business.js";
let Users = class Users extends BaseEntity {
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Users.prototype, "id", void 0);
__decorate([
    Column({ length: 255, nullable: false, unique: true }),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Users.prototype, "hashPassword", null);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "iamId", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], Users.prototype, "isVerified", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Users.prototype, "verificationToken", void 0);
__decorate([
    OneToMany(() => Expense, expense => expense.users, { eager: true, cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "expenses", void 0);
__decorate([
    OneToMany(() => Category, category => category.users, { eager: true, cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "categories", void 0);
__decorate([
    OneToMany(() => Income, income => income.user, { eager: true, cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "incomes", void 0);
__decorate([
    ManyToOne(() => Business, business => business.users, { eager: true }),
    __metadata("design:type", Business)
], Users.prototype, "business", void 0);
__decorate([
    OneToOne(() => Profile, profile => profile.user, { eager: true, cascade: true }),
    __metadata("design:type", Object)
], Users.prototype, "profile", void 0);
Users = __decorate([
    Entity()
], Users);
export { Users };
//# sourceMappingURL=Users.js.map