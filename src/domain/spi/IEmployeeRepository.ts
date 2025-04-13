import { EmployeeEntity } from '../entities/Employee';

export interface EmployeeRepository {
  create(employee: EmployeeEntity): Promise<string>;
}