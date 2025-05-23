// src/application/use_cases/GetEmployeeById.ts
import { Employee } from '../../domain/entities/Employee';
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';

export class GetEmployeeById {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(employeeId: string): Promise<Employee | null> {
    return this.employeeRepository.findById(employeeId);
  }
}
