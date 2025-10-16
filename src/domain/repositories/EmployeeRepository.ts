// src/domain/repositories/EmployeeRepository.ts
import { Employee, EmployeeProps } from '../entities/Employee'; 

export abstract class EmployeeRepository {
  abstract save(employee: Employee): Promise<Employee>;
  abstract findById(employeeId: string): Promise<Employee | null>;
  abstract findAll(): Promise<Employee[]>;
  abstract update(employeeId: string, employeeData: Partial<EmployeeProps>): Promise<Employee | null>; 
  abstract delete(employeeId: string): Promise<boolean>;
  abstract findDoctorsByIds(ids: string[]): Promise<Employee[]>; 
}
