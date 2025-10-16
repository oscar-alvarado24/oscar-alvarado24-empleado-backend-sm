import { logger } from '../../infrastructure/config/logger';
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';
import { CreateEmployeeDto } from '../dtos/CreateEmployeeDto'; 
import { EmployeeMapper } from '../mapper/EmployeeMapper';
import { EmployeeResponse } from '../dtos/EmployeeResponse';


export class CreateEmployee {
  constructor(private readonly employeeRepository: EmployeeRepository) { }

  async execute(employeeDto: CreateEmployeeDto): Promise<EmployeeResponse> {
    try {
      return EmployeeMapper.toEmployeeResponse(await this.employeeRepository.save(EmployeeMapper.toEmployeeFromCreateDto(employeeDto)));
    } catch (error) {
      logger.error('Error creating employee:', error);
      throw new Error('Error creating employee');
    }
  }
}
