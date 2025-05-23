import { Employee } from '../entities/Employee'; // Changed from EmployeeEntity to Employee

export interface EmployeeRepository { // This might conflict with the other EmployeeRepository interface
  create(employee: Employee): Promise<string>; // Changed from EmployeeEntity to Employee
}