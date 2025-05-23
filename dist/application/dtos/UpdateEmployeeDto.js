"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeDto = void 0;
// src/application/dtos/UpdateEmployeeDto.ts
const class_validator_1 = require("class-validator"); // Added IsNumber
class UpdateEmployeeDto {
}
exports.UpdateEmployeeDto = UpdateEmployeeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'First name must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Last name must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email should be in a valid format if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Position must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Department must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "department", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Second name must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "secondName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Second surname must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "secondSurName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Landline must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "landline", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description of residence must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "descriptionResidence", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Address must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Cell phone must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "cellPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Residences type must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "residencesType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Neighborhood must be a string if provided' }),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "neighborhood", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Empresa ID must be a number if provided' }),
    __metadata("design:type", Number)
], UpdateEmployeeDto.prototype, "empresa", void 0);
//# sourceMappingURL=UpdateEmployeeDto.js.map