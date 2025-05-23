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
exports.EmployeeController = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const CreateEmployeeDto_1 = require("../../../../application/dtos/CreateEmployeeDto");
const UpdateEmployeeDto_1 = require("../../../../application/dtos/UpdateEmployeeDto");
const logger_1 = require("../../../../config/logger"); // Import logger
class EmployeeController {
    constructor(createEmployeeUseCase, getEmployeeByIdUseCase, getAllEmployeesUseCase, updateEmployeeUseCase, deleteEmployeeUseCase) {
        this.createEmployeeUseCase = createEmployeeUseCase;
        this.getEmployeeByIdUseCase = getEmployeeByIdUseCase;
        this.getAllEmployeesUseCase = getAllEmployeesUseCase;
        this.updateEmployeeUseCase = updateEmployeeUseCase;
        this.deleteEmployeeUseCase = deleteEmployeeUseCase;
    }
    // Helper to format validation errors
    formatValidationErrors(errors) {
        return errors.map(err => {
            return { property: err.property, constraints: err.constraints };
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`POST /api/v1/employees - Request Body: ${JSON.stringify(req.body)}`);
            try {
                const createEmployeeDto = (0, class_transformer_1.plainToInstance)(CreateEmployeeDto_1.CreateEmployeeDto, req.body);
                const errors = yield (0, class_validator_1.validate)(createEmployeeDto);
                if (errors.length > 0) {
                    logger_1.logger.warn('Validation failed for create employee', { errors: this.formatValidationErrors(errors) });
                    res.status(400).json({
                        message: 'Validation failed',
                        errors: this.formatValidationErrors(errors)
                    });
                    return;
                }
                const employee = yield this.createEmployeeUseCase.execute(createEmployeeDto);
                logger_1.logger.info(`Employee created successfully: ${employee.id}`);
                res.status(201).json(employee);
            }
            catch (error) {
                logger_1.logger.error(`Error in create employee: ${error.message}`, error);
                next(error);
            }
        });
    }
    getById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeId = req.params.id;
            logger_1.logger.info(`GET /api/v1/employees/${employeeId}`);
            try {
                const employee = yield this.getEmployeeByIdUseCase.execute(employeeId);
                if (employee) {
                    logger_1.logger.info(`Employee found: ${employeeId}`);
                    res.status(200).json(employee);
                }
                else {
                    logger_1.logger.warn(`Employee not found: ${employeeId}`);
                    res.status(404).json({ message: 'Employee not found' });
                }
            }
            catch (error) {
                logger_1.logger.error(`Error in get employee by ID ${employeeId}: ${error.message}`, error);
                next(error);
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info('GET /api/v1/employees');
            try {
                const employees = yield this.getAllEmployeesUseCase.execute();
                logger_1.logger.info(`Retrieved ${employees.length} employees`);
                res.status(200).json(employees);
            }
            catch (error) {
                logger_1.logger.error(`Error in get all employees: ${error.message}`, error);
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeId = req.params.id;
            logger_1.logger.info(`PUT /api/v1/employees/${employeeId} - Request Body: ${JSON.stringify(req.body)}`);
            try {
                const updateEmployeeDto = (0, class_transformer_1.plainToInstance)(UpdateEmployeeDto_1.UpdateEmployeeDto, req.body);
                const errors = yield (0, class_validator_1.validate)(updateEmployeeDto);
                if (errors.length > 0) {
                    logger_1.logger.warn(`Validation failed for update employee ${employeeId}`, { errors: this.formatValidationErrors(errors) });
                    res.status(400).json({
                        message: 'Validation failed for update',
                        errors: this.formatValidationErrors(errors)
                    });
                    return;
                }
                if (Object.keys(updateEmployeeDto).length === 0) {
                    logger_1.logger.warn(`No update data provided for employee ${employeeId}`);
                    res.status(400).json({ message: 'No update data provided' });
                    return;
                }
                const employee = yield this.updateEmployeeUseCase.execute(employeeId, updateEmployeeDto);
                if (employee) {
                    logger_1.logger.info(`Employee updated successfully: ${employeeId}`);
                    res.status(200).json(employee);
                }
                else {
                    logger_1.logger.warn(`Employee not found for update: ${employeeId}`);
                    res.status(404).json({ message: 'Employee not found for update' });
                }
            }
            catch (error) {
                logger_1.logger.error(`Error in update employee ${employeeId}: ${error.message}`, error);
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeId = req.params.id;
            logger_1.logger.info(`DELETE /api/v1/employees/${employeeId}`);
            try {
                const success = yield this.deleteEmployeeUseCase.execute(employeeId);
                if (success) {
                    logger_1.logger.info(`Employee deleted successfully: ${employeeId}`);
                    res.status(204).send();
                }
                else {
                    logger_1.logger.warn(`Employee not found for delete: ${employeeId}`);
                    res.status(404).json({ message: 'Employee not found or could not be deleted' });
                }
            }
            catch (error) {
                logger_1.logger.error(`Error in delete employee ${employeeId}: ${error.message}`, error);
                next(error);
            }
        });
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=EmployeeController.js.map