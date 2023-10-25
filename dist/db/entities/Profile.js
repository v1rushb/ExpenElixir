var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users.js";
let Profile = class Profile extends BaseEntity {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Profile.prototype, "id", void 0);
__decorate([
    Column({ length: 255, nullable: false }),
    __metadata("design:type", String)
], Profile.prototype, "firstName", void 0);
__decorate([
    Column({ length: 255, nullable: false }),
    __metadata("design:type", String)
], Profile.prototype, "lastName", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", String)
], Profile.prototype, "phoneNumber", void 0);
__decorate([
    Column({ default: 'USD' }),
    __metadata("design:type", String)
], Profile.prototype, "Currency", void 0);
__decorate([
    Column({
        type: 'enum',
        enum: ['Member', 'Root', 'User'],
        default: 'Member'
    }),
    __metadata("design:type", String)
], Profile.prototype, "role", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Date)
], Profile.prototype, "subscription_date", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Boolean)
], Profile.prototype, "hasSentEmail", void 0);
__decorate([
    OneToOne(() => Users, user => user.profile, { onDelete: 'CASCADE' }),
    JoinColumn(),
    __metadata("design:type", Object)
], Profile.prototype, "user", void 0);
Profile = __decorate([
    Entity()
], Profile);
export { Profile };
//# sourceMappingURL=Profile.js.map