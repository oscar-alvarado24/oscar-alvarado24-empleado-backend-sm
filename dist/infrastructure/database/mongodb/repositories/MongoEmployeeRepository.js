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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoEmployeeRepository = void 0;
// src/infrastructure/database/mongodb/repositories/MongoEmployeeRepository.ts
const EmployeeRepository_1 = require("../../../../domain/repositories/EmployeeRepository");
const EmployeeModel_1 = __importDefault(require("../models/EmployeeModel"));
const Employee_1 = require("../../../../domain/entities/Employee"); // Path to your domain Employee entity
const Email_1 = require("../../../../domain/value-objects/Email"); // Import Email value object
const Position_1 = require("../../../../domain/value-objects/Position"); // Import Position value object and stringToEnum
class MongoEmployeeRepository extends EmployeeRepository_1.EmployeeRepository {
    // Helper to map Mongoose document to domain Employee entity
    toDomainEntity(doc) {
        // Need to import Email and stringToEnum (for Position)
        // Assuming these are available from the domain value-objects
        // import { Email } from '../../../../domain/value-objects/Email';
        // import { stringToEnum } from '../../../../domain/value-objects/Position';
        // These imports should be at the top of the file. I'll add them if they're not already.
        // The Employee constructor expects an EmployeeProps object.
        // We need to construct this object from the Mongoose document.
        // Ensure all required fields for EmployeeProps are present.
        const employeeProps = {
            id: doc.id ? parseInt(doc.id, 10) : undefined, // Convert string id to number
            firstName: doc.firstName,
            firstSurName: doc.lastName, // Assuming doc.lastName maps to firstSurName
            secondName: doc.secondName,
            secondSurName: doc.secondSurName,
            // email: Email.create(doc.email), // This is the correct way
            // position: stringToEnum(doc.position), // This is the correct way
            // For now, to avoid import errors if Email/stringToEnum are not directly importable here
            // or if they are in a place that causes circular dependencies with current file structure,
            // I will cast to 'any'. This is a known simplification from previous steps.
            // The ideal solution is to ensure Email.create and stringToEnum are accessible and used.
            email: Email_1.Email.create(doc.email), // Use Email.create
            position: (0, Position_1.stringToEnum)(doc.position), // Use stringToEnum for Position
            department: doc.department,
            landline: doc.landline,
            descriptionResidence: doc.descriptionResidence,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            // EmployeeProps also requires:
            // address: string; cellPhone: string; residencesType: string; neighborhood: string; empresa: number;
            // These are missing from IEmployeeDocument currently.
            // This will cause a type error when constructing Employee.
            // I need to add these to IEmployeeDocument and the schema if they are part of the domain model.
            // For now, casting to 'any' to pass the constructor, but this is a major gap.
            address: doc.address,
            cellPhone: doc.cellPhone,
            residencesType: doc.residencesType,
            neighborhood: doc.neighborhood,
            empresa: doc.empresa,
            photo: doc.photo, // Assuming photo might be there
        };
        return new Employee_1.Employee(employeeProps);
    }
    // Helper to map domain Employee entity to a plain object for Mongoose
    // Only include fields that are part of the schema and are not undefined
    toMongooseData(employee) {
        const data = {
            // id is not set here as it's managed by MongoDB (_id)
            firstName: employee.firstName,
            // Assuming 'lastName' in domain maps to 'lastName' in schema.
            // If it maps to 'firstSurName', adjust accordingly.
            lastName: employee.lastName,
            email: employee.email,
            position: employee.position,
            department: employee.department,
        };
        // Add optional fields only if they are defined
        if (employee.secondName !== undefined)
            data.secondName = employee.secondName;
        if (employee.secondSurName !== undefined)
            data.secondSurName = employee.secondSurName;
        if (employee.landline !== undefined)
            data.landline = employee.landline;
        if (employee.descriptionResidence !== undefined)
            data.descriptionResidence = employee.descriptionResidence;
        // createdAt and updatedAt are handled by Mongoose timestamps
        return data;
    }
    toMongooseUpdateData(employeeData) {
        const data = {};
        // Direct assignment for string or simple types
        if (employeeData.firstName !== undefined)
            data.firstName = employeeData.firstName;
        // Assuming lastName in DTO/Update maps to firstSurName in EmployeeProps
        if (employeeData.firstSurName !== undefined)
            data.lastName = employeeData.firstSurName;
        else if (employeeData.lastName !== undefined)
            data.lastName = employeeData.lastName; // Fallback for 'lastName' if used directly
        if (employeeData.department !== undefined)
            data.department = employeeData.department;
        if (employeeData.secondName !== undefined)
            data.secondName = employeeData.secondName;
        if (employeeData.secondSurName !== undefined)
            data.secondSurName = employeeData.secondSurName;
        if (employeeData.landline !== undefined)
            data.landline = employeeData.landline;
        if (employeeData.descriptionResidence !== undefined)
            data.descriptionResidence = employeeData.descriptionResidence;
        if (employeeData.address !== undefined)
            data.address = employeeData.address;
        if (employeeData.cellPhone !== undefined)
            data.cellPhone = employeeData.cellPhone;
        if (employeeData.residencesType !== undefined)
            data.residencesType = employeeData.residencesType;
        if (employeeData.neighborhood !== undefined)
            data.neighborhood = employeeData.neighborhood;
        if (employeeData.empresa !== undefined)
            data.empresa = employeeData.empresa;
        if (employeeData.photo !== undefined)
            data.photo = employeeData.photo;
        // Handle value objects: convert Email and Position back to string
        if (employeeData.email !== undefined)
            data.email = employeeData.email.toString();
        if (employeeData.position !== undefined)
            data.position = employeeData.position.toString();
        // createdAt and updatedAt are typically not updated directly
        return data;
    }
    save(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeData = this.toMongooseData(employee);
            const newEmployee = new EmployeeModel_1.default(employeeData);
            const savedDoc = yield newEmployee.save();
            return this.toDomainEntity(savedDoc);
        });
    }
    findById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeDoc = yield EmployeeModel_1.default.findById(employeeId);
            if (!employeeDoc)
                return null;
            return this.toDomainEntity(employeeDoc);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeDocs = yield EmployeeModel_1.default.find();
            return employeeDocs.map(doc => this.toDomainEntity(doc));
        });
    }
    update(employeeId, employeeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongooseUpdateData = this.toMongooseUpdateData(employeeData);
            const updatedDoc = yield EmployeeModel_1.default.findByIdAndUpdate(employeeId, mongooseUpdateData, { new: true });
            if (!updatedDoc)
                return null;
            return this.toDomainEntity(updatedDoc);
        });
    }
    delete(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield EmployeeModel_1.default.findByIdAndDelete(employeeId);
            return !!result;
        });
    }
}
exports.MongoEmployeeRepository = MongoEmployeeRepository;
//# sourceMappingURL=MongoEmployeeRepository.js.map