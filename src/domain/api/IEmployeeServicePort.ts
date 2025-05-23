import { Employee } from "../entities/Employee"; // Changed from EmployeeEntity to Employee

export interface EmployeeServicePort {
    createEmployee(employee: Employee): Promise<string>; // Changed from EmployeeEntity to Employee
}