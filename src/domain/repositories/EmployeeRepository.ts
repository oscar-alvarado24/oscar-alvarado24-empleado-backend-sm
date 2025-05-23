// src/domain/repositories/EmployeeRepository.ts
import { Employee, EmployeeProps } from '../entities/Employee'; // Adjusted path assuming Employee.ts is in ../entities; Added EmployeeProps

export abstract class EmployeeRepository {
  abstract save(employee: Employee): Promise<Employee>;
  abstract findById(employeeId: string): Promise<Employee | null>;
  abstract findAll(): Promise<Employee[]>;
  abstract update(employeeId: string, employeeData: Partial<EmployeeProps>): Promise<Employee | null>; // Changed from Partial<Employee>
  abstract delete(employeeId: string): Promise<boolean>;
}
