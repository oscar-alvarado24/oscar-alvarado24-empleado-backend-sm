// src/application/use_cases/DeleteEmployee.ts
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';

export class DeleteEmployee {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(employeeId: string): Promise<boolean> {
    return this.employeeRepository.delete(employeeId);
  }
}
