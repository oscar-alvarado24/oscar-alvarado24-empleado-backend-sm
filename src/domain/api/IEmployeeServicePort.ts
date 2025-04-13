import { EmployeeEntity } from "../entities/Employee";

export interface EmployeeServicePort {
    createEmployee(employee: EmployeeEntity): Promise<string>;
}