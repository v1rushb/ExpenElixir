var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity } from "typeorm";
import { Expense } from "./Expense.js";
import { Users } from "./Users.js";
let Category = class Category extends BaseEntity {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    Column({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Category.prototype, "title", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", Number)
], Category.prototype, "budget", void 0);
__decorate([
    Column({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Category.prototype, "totalExpenses", void 0);
__decorate([
    OneToMany(() => Expense, expense => expense.category),
    __metadata("design:type", Array)
], Category.prototype, "expenses", void 0);
__decorate([
    ManyToOne(() => Users, user => user.expenses, { onDelete: "CASCADE" }),
    __metadata("design:type", String)
], Category.prototype, "users", void 0);
Category = __decorate([
    Entity()
], Category);
export { Category };
//# sourceMappingURL=Category.js.map