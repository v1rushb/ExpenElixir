var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users.js";
import { Category } from "./Category.js";
let Expense = class Expense extends BaseEntity {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Expense.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Expense.prototype, "title", void 0);
__decorate([
    Column({ type: 'double' }),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    Column(),
    __metadata("design:type", Date)
], Expense.prototype, "expenseDate", void 0);
__decorate([
    Column({ length: 255 }),
    __metadata("design:type", String)
], Expense.prototype, "description", void 0);
__decorate([
    Column({ name: 'pictureURL', default: 'http://default' }),
    __metadata("design:type", String)
], Expense.prototype, "picURL", void 0);
__decorate([
    ManyToOne(() => Users, user => user.expenses),
    __metadata("design:type", String)
], Expense.prototype, "users", void 0);
__decorate([
    ManyToOne(() => Category, category => category.expenses, { eager: true }),
    __metadata("design:type", Category)
], Expense.prototype, "category", void 0);
Expense = __decorate([
    Entity()
], Expense);
export { Expense };
//# sourceMappingURL=Expense.js.map