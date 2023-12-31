var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users.js";
let Business = class Business extends BaseEntity {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Business.prototype, "id", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", String)
], Business.prototype, "businessName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Business.prototype, "rootUserID", void 0);
__decorate([
    OneToOne(() => Users, user => user.businessb, { onDelete: "CASCADE" }),
    JoinColumn(),
    __metadata("design:type", Object)
], Business.prototype, "userb", void 0);
__decorate([
    OneToMany(() => Users, user => user.business),
    __metadata("design:type", Array)
], Business.prototype, "users", void 0);
Business = __decorate([
    Entity()
], Business);
export { Business };
//# sourceMappingURL=Business.js.map