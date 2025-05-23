// src/application/use_cases/CreateEmployee.ts
import { Employee, EmployeeProps } from '../../domain/entities/Employee'; // Import EmployeeProps
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';
import { Email } from '../../domain/value-objects/Email'; // Import Email
import { Position, stringToEnum } from '../../domain/value-objects/Position'; // Import Position and stringToEnum
import { CreateEmployeeDto } from '../dtos/CreateEmployeeDto'; // Import CreateEmployeeDto

// The CreateEmployeeData interface is removed as CreateEmployeeDto is used.

export class CreateEmployee {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(employeeDto: CreateEmployeeDto): Promise<Employee> {
    // Constructing EmployeeProps explicitly from employeeDto:
    const employeeProps: EmployeeProps = {
      id: undefined, // Use undefined for new entities, EmployeeProps expects 'number | undefined'
      firstName: employeeDto.firstName,
      firstSurName: employeeDto.lastName, // Assuming DTO's lastName maps to domain's firstSurName
      secondName: employeeDto.secondName,
      secondSurName: employeeDto.secondSurName,
      email: Email.create(employeeDto.email), // Create Email value object from DTO
      position: stringToEnum(employeeDto.position), // Create Position value object from DTO
      department: employeeDto.department,
      address: employeeDto.address, // No longer need 'as any' since CreateEmployeeDto is updated
      cellPhone: employeeDto.cellPhone, // No longer need 'as any'
      residencesType: employeeDto.residencesType, // No longer need 'as any'
      neighborhood: employeeDto.neighborhood, // No longer need 'as any'
      empresa: employeeDto.empresa, // No longer need 'as any'
      landline: employeeDto.landline,
      descriptionResidence: employeeDto.descriptionResidence,
      // photo, createdAt, updatedAt are typically not set at creation via DTO
    };

    const employeeToCreate = new Employee(employeeProps);
    return this.employeeRepository.save(employeeToCreate);
  }
}
