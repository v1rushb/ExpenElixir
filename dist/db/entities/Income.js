var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { Users } from "./Users.js";
let Income = class Income extends BaseEntity {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Income.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Income.prototype, "title", void 0);
__decorate([
    Column({ type: 'double' }),
    __metadata("design:type", Number)
], Income.prototype, "amount", void 0);
__decorate([
    Column({ name: 'income_date' }),
    __metadata("design:type", Date)
], Income.prototype, "incomeDate", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Income.prototype, "description", void 0);
__decorate([
    ManyToOne(() => Users, user => user.incomes, { onDelete: 'CASCADE' }),
    __metadata("design:type", String)
], Income.prototype, "user", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Income.prototype, "currencyData", void 0);
Income = __decorate([
    Entity()
], Income);
export { Income };
//# sourceMappingURL=Income.js.map