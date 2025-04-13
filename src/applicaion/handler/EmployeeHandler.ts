
import { EmployeeRequest } from "../dto/EmployeeRequest";
import { IEmployeeHandler } from "./IEmployeeHandler";
import { EmployeeMapper } from "../mappers/mapper";
import { BadEmailExceptions } from "../../domain/exceptions/BadEmailExceptions";
import { ValidationError } from "./exceptions/ValidationError";
import { EmployeeServicePort } from "../../domain/api/IEmployeeServicePort";

export class EmployeeHandler implements IEmployeeHandler {
    constructor(private readonly employeeServicePort: EmployeeServicePort) { }

    async createEmployee(employee: EmployeeRequest): Promise<any> {
        try {
            const employeeEntity = EmployeeMapper.toEntity(employee);
            return await this.employeeServicePort.createEmployee(employeeEntity);
        } catch (error) {
            if (error instanceof BadEmailExceptions) {
                throw new ValidationError(error.message);
            } else {
                throw error;
            }
        }
    }

}