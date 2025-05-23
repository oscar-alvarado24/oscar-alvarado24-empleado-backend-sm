"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployee = void 0;
// src/application/use_cases/CreateEmployee.ts
const Employee_1 = require("../../domain/entities/Employee"); // Import EmployeeProps
const Email_1 = require("../../domain/value-objects/Email"); // Import Email
const Position_1 = require("../../domain/value-objects/Position"); // Import Position and stringToEnum
// The CreateEmployeeData interface is removed as CreateEmployeeDto is used.
class CreateEmployee {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    execute(employeeDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Constructing EmployeeProps explicitly from employeeDto:
            const employeeProps = {
                id: undefined, // Use undefined for new entities, EmployeeProps expects 'number | undefined'
                firstName: employeeDto.firstName,
                firstSurName: employeeDto.lastName, // Assuming DTO's lastName maps to domain's firstSurName
                secondName: employeeDto.secondName,
                secondSurName: employeeDto.secondSurName,
                email: Email_1.Email.create(employeeDto.email), // Create Email value object from DTO
                position: (0, Position_1.stringToEnum)(employeeDto.position), // Create Position value object from DTO
                department: employeeDto.department,
                address: employeeDto.address, // No longer need 'as any' since CreateEmployeeDto is updated
                cellPhone: employeeDto.cellPhone, // No longer need 'as any'
                residencesType: employeeDto.residencesType, // No longer need 'as any'
                neighborhood: employeeDto.neighborhood, // No longer need 'as any'
                empresa: employeeDto.empresa, // No longer need 'as any'
                landline: employeeDto.landline,
                descriptionResidence: employeeDto.descriptionResidence,
                // photo, createdAt, updatedAt are typically not set at creation via DTO
            };
            const employeeToCreate = new Employee_1.Employee(employeeProps);
            return this.employeeRepository.save(employeeToCreate);
        });
    }
}
exports.CreateEmployee = CreateEmployee;
//# sourceMappingURL=CreateEmployee.js.map