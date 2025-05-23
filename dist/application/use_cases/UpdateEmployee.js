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
exports.UpdateEmployee = void 0;
const Email_1 = require("../../domain/value-objects/Email"); // For Email transformation
const Position_1 = require("../../domain/value-objects/Position"); // For Position transformation
// The UpdateEmployeeData type is no longer needed as we use UpdateEmployeeDto and map to Partial<EmployeeProps>
// export type UpdateEmployeeData = Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>;
class UpdateEmployee {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    execute(employeeId, employeeDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Map UpdateEmployeeDto to Partial<EmployeeProps> for the repository
            // Only include fields present in the DTO and transform value objects
            const employeePropsToUpdate = {};
            if (employeeDto.firstName !== undefined) {
                employeePropsToUpdate.firstName = employeeDto.firstName;
            }
            if (employeeDto.lastName !== undefined) {
                // Assuming DTO's lastName maps to domain's firstSurName
                employeePropsToUpdate.firstSurName = employeeDto.lastName;
            }
            if (employeeDto.secondName !== undefined) {
                employeePropsToUpdate.secondName = employeeDto.secondName;
            }
            if (employeeDto.secondSurName !== undefined) {
                employeePropsToUpdate.secondSurName = employeeDto.secondSurName;
            }
            if (employeeDto.email !== undefined) {
                employeePropsToUpdate.email = Email_1.Email.create(employeeDto.email);
            }
            if (employeeDto.position !== undefined) {
                employeePropsToUpdate.position = (0, Position_1.stringToEnum)(employeeDto.position);
            }
            if (employeeDto.department !== undefined) {
                employeePropsToUpdate.department = employeeDto.department;
            }
            if (employeeDto.landline !== undefined) {
                employeePropsToUpdate.landline = employeeDto.landline;
            }
            if (employeeDto.descriptionResidence !== undefined) {
                employeePropsToUpdate.descriptionResidence = employeeDto.descriptionResidence;
            }
            // Assuming UpdateEmployeeDto might also contain address, cellPhone, etc.
            // as per a more complete DTO that mirrors CreateEmployeeDto's optional fields.
            // These fields are now formally part of UpdateEmployeeDto.
            if (employeeDto.address !== undefined) {
                employeePropsToUpdate.address = employeeDto.address;
            }
            if (employeeDto.cellPhone !== undefined) {
                employeePropsToUpdate.cellPhone = employeeDto.cellPhone;
            }
            if (employeeDto.residencesType !== undefined) {
                employeePropsToUpdate.residencesType = employeeDto.residencesType;
            }
            if (employeeDto.neighborhood !== undefined) {
                employeePropsToUpdate.neighborhood = employeeDto.neighborhood;
            }
            if (employeeDto.empresa !== undefined) {
                employeePropsToUpdate.empresa = employeeDto.empresa;
            }
            // Ensure we don't pass an empty object if no relevant fields were in the DTO
            if (Object.keys(employeePropsToUpdate).length === 0) {
                // Optionally, you might want to return the existing employee or throw an error
                // if no updatable fields were provided. For now, we'll proceed,
                // and the repository should handle an empty update data object gracefully.
                // Or, fetch and return the employee without updating if that's the desired behavior.
                return this.employeeRepository.findById(employeeId);
            }
            return this.employeeRepository.update(employeeId, employeePropsToUpdate);
        });
    }
}
exports.UpdateEmployee = UpdateEmployee;
//# sourceMappingURL=UpdateEmployee.js.map