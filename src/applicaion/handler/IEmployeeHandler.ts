import { EmployeeRequest } from "../dto/EmployeeRequest";

export interface IEmployeeHandler{
    createEmployee(employee: EmployeeRequest): Promise<string>;
}