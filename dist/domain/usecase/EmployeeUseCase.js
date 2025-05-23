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
exports.EmployeeUseCase = void 0;
class EmployeeUseCase {
    constructor(employeeRepository, sesService, cognitoService) {
        this.employeeRepository = employeeRepository;
        this.sesService = sesService;
        this.cognitoService = cognitoService;
    }
    createEmployee(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Assuming employee.email and employee.position are accessible strings from the Employee object
                // If Employee object's email/position are value objects, they need .toString() or similar
                yield this.sesService.registerEmailInSes(employee.email.toString()); // Assuming email is a Value Object
                yield this.cognitoService.createCognitoUser(employee.email.toString(), employee.position.toString()); // Assuming position is a Value Object
                return yield this.employeeRepository.create(employee); // This employeeRepository is the SPI version
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Error creating employee: ${error.message}`);
                }
                else {
                    console.error(`Error creating employee: ${String(error)}`);
                }
                yield this.rollback(employee, error);
                throw error;
            }
        });
    }
    rollback(employee, error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error.message.includes("Mongo")) {
                try {
                    yield this.cognitoService.deleteCognitoUser(employee.email.toString()); // Assuming email is a Value Object
                }
                catch (rollbackError) {
                    if (rollbackError instanceof Error) {
                        console.error(`Rollback error: ${rollbackError.message}`);
                    }
                    else {
                        console.error(`Rollback error: ${String(rollbackError)}`);
                    }
                }
            }
        });
    }
}
exports.EmployeeUseCase = EmployeeUseCase;
//# sourceMappingURL=EmployeeUseCase.js.map