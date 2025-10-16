// src/application/use_cases/UpdateEmployee.ts
import { Employee, EmployeeProps } from '../../domain/entities/Employee'; // Import EmployeeProps
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';
import { UpdateEmployeeDto } from '../dtos/UpdateEmployeeDto'; // Import UpdateEmployeeDto
import { Email } from '../../domain/value-objects/Email'; // For Email transformation
import { stringToEnum } from '../../domain/value-objects/Position'; // For Position transformation
import { UpdateWithoutDataException } from '../../application/exceptions/UpdateWithoutDataException';

// The UpdateEmployeeData type is no longer needed as we use UpdateEmployeeDto and map to Partial<EmployeeProps>
// export type UpdateEmployeeData = Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>;

export class UpdateEmployee {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(employeeId: string, employeeDto: UpdateEmployeeDto): Promise<Employee | null> {
    // Map UpdateEmployeeDto to Partial<EmployeeProps> for the repository
    // Only include fields present in the DTO and transform value objects
    const employeePropsToUpdate: Partial<EmployeeProps> = {};

    if (employeeDto.firstName !== undefined) {
      employeePropsToUpdate.firstName = employeeDto.firstName;
    }
    if (employeeDto.lastName !== undefined) {
      employeePropsToUpdate.lastName = employeeDto.lastName;
    }
    if (employeeDto.secondName !== undefined) {
      employeePropsToUpdate.secondName = employeeDto.secondName;
    }
    
    if (employeeDto.email !== undefined) {
      employeePropsToUpdate.email = Email.create(employeeDto.email);
    }
    if (employeeDto.position !== undefined) {
      employeePropsToUpdate.position = stringToEnum(employeeDto.position);
    }

    if (employeeDto.landline !== undefined) {
      employeePropsToUpdate.landline = employeeDto.landline;
    }
    if (employeeDto.descriptionResidence !== undefined) {
      employeePropsToUpdate.descriptionResidence = employeeDto.descriptionResidence;
    }
    
    if (employeeDto.address !== undefined) {
        employeePropsToUpdate.address = employeeDto.address;
    }
    if (employeeDto.cellPhone !== undefined) {
        employeePropsToUpdate.cellPhone = employeeDto.cellPhone;
    }
    if (employeeDto.residencesType !== undefined) {
        employeePropsToUpdate.residencesType = employeeDto.residencesType;
    }
    if (employeeDto.neighborhood !== undefined) {
        employeePropsToUpdate.neighborhood = employeeDto.neighborhood;
    }
    if (employeeDto.company !== undefined) {
        employeePropsToUpdate.company = employeeDto.company;
    }
    
    // Ensure we don't pass an empty object if no relevant fields were in the DTO
    if (Object.keys(employeePropsToUpdate).length === 0) {
      throw new UpdateWithoutDataException('No fields to update');
    }

    return this.employeeRepository.update(employeeId, employeePropsToUpdate);
  }
}
