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
exports.EmployeeHandler = void 0;
const mapper_1 = require("../mappers/mapper");
const BadEmailExceptions_1 = require("../../domain/exceptions/BadEmailExceptions");
const ValidationError_1 = require("./exceptions/ValidationError");
class EmployeeHandler {
    constructor(employeeServicePort) {
        this.employeeServicePort = employeeServicePort;
    }
    createEmployee(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employeeEntity = mapper_1.EmployeeMapper.toEntity(employee);
                return yield this.employeeServicePort.createEmployee(employeeEntity);
            }
            catch (error) {
                if (error instanceof BadEmailExceptions_1.BadEmailExceptions) {
                    throw new ValidationError_1.ValidationError(error.message);
                }
                else {
                    throw error;
                }
            }
        });
    }
}
exports.EmployeeHandler = EmployeeHandler;
//# sourceMappingURL=EmployeeHandler.js.map