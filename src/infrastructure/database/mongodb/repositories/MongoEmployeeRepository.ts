// src/infrastructure/database/mongodb/repositories/MongoEmployeeRepository.ts
import { EmployeeRepository } from '../../../../domain/repositories/EmployeeRepository';
import EmployeeModel, { IEmployeeDocument } from '../models/EmployeeModel';
import { Employee, EmployeeProps } from '../../../../domain/entities/Employee';
import { Email } from '../../../../domain/value-objects/Email';
import { stringToEnum } from '../../../../domain/value-objects/Position';
import { logger } from '../../../../config/logger';

export class MongoEmployeeRepository extends EmployeeRepository {
  // Helper to map Mongoose document to domain Employee entity
  private toDomainEntity(doc: IEmployeeDocument): Employee {
    const employeeProps: EmployeeProps = {
      id: doc.id ? parseInt(doc.id, 10) : undefined,
      firstName: doc.firstName,
      firstSurName: doc.lastName,
      secondName: doc.secondName,
      secondSurName: doc.secondSurName,
      email: Email.create(doc.email),
      position: stringToEnum(doc.position),
      department: doc.department,
      landline: doc.landline,
      descriptionResidence: doc.descriptionResidence,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      address: doc.address,
      cellPhone: doc.cellPhone,
      residencesType: doc.residencesType,
      neighborhood: doc.neighborhood,
      empresa: doc.empresa,
      photo: doc.photo,
    };
    return new Employee(employeeProps);
  }

  // Helper to map domain Employee entity to a plain object for Mongoose
  // CORREGIDO: Ahora incluye TODOS los campos requeridos
  private toMongooseData(employee: Employee): Partial<IEmployeeDocument> {
    const data: Partial<IEmployeeDocument> = {
      firstName: employee.firstName,
      lastName: employee.lastName, // Mapear correctamente
      email: typeof employee.email === 'string' ? employee.email : (employee.email as { toString: () => string })?.toString() ?? '',
      position: typeof employee.position === 'string' ? employee.position : (employee.position as { toString: () => string })?.toString() ?? '',
      department: employee.department,
      // CAMPOS REQUERIDOS QUE FALTABAN:
      address: employee.address,
      cellPhone: employee.cellPhone,
      residencesType: employee.residencesType,
      neighborhood: employee.neighborhood,
      empresa: employee.empresa,
    };

    // Add optional fields only if they are defined
    if (employee.secondName !== undefined) data.secondName = employee.secondName;
    if (employee.secondSurName !== undefined) data.secondSurName = employee.secondSurName;
    if (employee.landline !== undefined) data.landline = employee.landline;
    if (employee.descriptionResidence !== undefined) data.descriptionResidence = employee.descriptionResidence;
    if (employee.photo !== undefined) data.photo = employee.photo;
    
    return data;
  }

  private toMongooseUpdateData(employeeData: Partial<EmployeeProps>): Partial<IEmployeeDocument> {
    const data: Partial<IEmployeeDocument> = {};
    
    // Direct assignment for string or simple types
    if (employeeData.firstName !== undefined) data.firstName = employeeData.firstName;
    if (employeeData.firstSurName !== undefined) data.lastName = employeeData.firstSurName; 
    else if ((employeeData as any).lastName !== undefined) data.lastName = (employeeData as any).lastName;
    
    if (employeeData.department !== undefined) data.department = employeeData.department;
    if (employeeData.secondName !== undefined) data.secondName = employeeData.secondName;
    if (employeeData.secondSurName !== undefined) data.secondSurName = employeeData.secondSurName;
    if (employeeData.landline !== undefined) data.landline = employeeData.landline;
    if (employeeData.descriptionResidence !== undefined) data.descriptionResidence = employeeData.descriptionResidence;
    if (employeeData.address !== undefined) data.address = employeeData.address;
    if (employeeData.cellPhone !== undefined) data.cellPhone = employeeData.cellPhone;
    if (employeeData.residencesType !== undefined) data.residencesType = employeeData.residencesType;
    if (employeeData.neighborhood !== undefined) data.neighborhood = employeeData.neighborhood;
    if (employeeData.empresa !== undefined) data.empresa = employeeData.empresa;
    if (employeeData.photo !== undefined) data.photo = employeeData.photo;

    // Handle value objects: convert Email and Position back to string
    if (employeeData.email !== undefined) {
      data.email = typeof employeeData.email === 'string' ? employeeData.email : employeeData.email?.toString() || '';
    }
    if (employeeData.position !== undefined) {
      data.position = typeof employeeData.position === 'string' ? employeeData.position : (employeeData.position as { toString: () => string })?.toString() ?? '';
    }
    
    return data;
  }

  async save(employee: Employee): Promise<Employee> {
    logger.info('Saving employee process');
    
    // Log del empleado antes de mapear
    logger.info('Employee to save:', {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      address: employee.address,
      cellPhone: employee.cellPhone,
      neighborhood: employee.neighborhood,
      residencesType: employee.residencesType,
      empresa: employee.empresa
    });
    
    const employeeData = this.toMongooseData(employee);
    const newEmployee = new EmployeeModel(employeeData);    
    const savedDoc = await newEmployee.save();
    logger.info('Employee saved:', savedDoc);
    return this.toDomainEntity(savedDoc);
  }

  async findById(employeeId: string): Promise<Employee | null> {
    const employeeDoc = await EmployeeModel.findById(employeeId);
    if (!employeeDoc) return null;
    return this.toDomainEntity(employeeDoc);
  }

  async findAll(): Promise<Employee[]> {
    const employeeDocs = await EmployeeModel.find();
    return employeeDocs.map(doc => this.toDomainEntity(doc));
  }

  async update(employeeId: string, employeeData: Partial<EmployeeProps>): Promise<Employee | null> {
    const mongooseUpdateData = this.toMongooseUpdateData(employeeData);
    const updatedDoc = await EmployeeModel.findByIdAndUpdate(employeeId, mongooseUpdateData, { new: true });
    if (!updatedDoc) return null;
    return this.toDomainEntity(updatedDoc);
  }

  async delete(employeeId: string): Promise<boolean> {
    const result = await EmployeeModel.findByIdAndDelete(employeeId);
    return !!result;
  }
}