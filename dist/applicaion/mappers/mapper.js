"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeMapper = void 0;
const class_transformer_1 = require("class-transformer");
const EmployeeRequest_1 = require("../dto/EmployeeRequest");
const Employee_1 = require("../../domain/entities/Employee"); // Updated to Employee
const Email_1 = require("../../domain/value-objects/Email");
const Position_1 = require("../../domain/value-objects/Position");
const logger_1 = require("../../config/logger");
const MapperError_1 = require("../handler/exceptions/MapperError");
class EmployeeMapper {
    static toEntity(employeeRequest) {
        try {
            const transformedData = (0, class_transformer_1.plainToClass)(EmployeeRequest_1.EmployeeRequest, employeeRequest);
            const props = {
                email: Email_1.Email.create(transformedData.email),
                firstName: transformedData.firstName,
                department: transformedData.department, // Added department
                secondName: transformedData.secondName,
                firstSurName: transformedData.firstSurName,
                secondSurName: transformedData.secondSurName,
                address: transformedData.address,
                landline: transformedData.landline,
                cellPhone: transformedData.cellPhone,
                residencesType: transformedData.residencesType,
                descriptionResidence: transformedData.descriptionResidence,
                neighborhood: transformedData.neighborhood,
                position: (0, Position_1.stringToEnum)(transformedData.position),
                empresa: transformedData.empresa,
            };
            return new Employee_1.Employee(props); // Updated to Employee
        }
        catch (error) {
            logger_1.logger.error(error);
            throw new MapperError_1.MapperError(`Error al convertir DTO a Entity`);
        }
    }
    static toDTO(employeeEntity) {
        try {
            const plainObject = (0, class_transformer_1.instanceToPlain)(employeeEntity);
            return (0, class_transformer_1.plainToClass)(EmployeeRequest_1.EmployeeRequest, plainObject);
        }
        catch (error) {
            logger_1.logger.error(error);
            throw new MapperError_1.MapperError(`Error al convertir Entity a DTO`);
        }
    }
}
exports.EmployeeMapper = EmployeeMapper;
//# sourceMappingURL=mapper.js.map