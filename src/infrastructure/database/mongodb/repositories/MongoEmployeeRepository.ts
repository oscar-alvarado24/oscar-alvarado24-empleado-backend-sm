import { EmployeeRepository } from '../../../../domain/repositories/EmployeeRepository';
import EmployeeModel, { IEmployeeDocument } from '../models/EmployeeModel';
import { Employee, EmployeeProps } from '../../../../domain/entities/Employee';
import { Email } from '../../../../domain/value-objects/Email';
import { stringToEnum } from '../../../../domain/value-objects/Position';
import { logger } from '../../../config/logger';

export class MongoEmployeeRepository extends EmployeeRepository {
  
  // Helper to map Mongoose document to domain Employee entity
  private toDomainEntity(doc: IEmployeeDocument): Employee {
    const employeeProps: EmployeeProps = {
      id: doc.id ,
      firstName: doc.firstName,
      lastName: doc.lastName,
      secondName: doc.secondName,
      email: Email.create(doc.email),
      position: stringToEnum(doc.position),
      landline: doc.landline,
      descriptionResidence: doc.descriptionResidence,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      address: doc.address,
      cellPhone: doc.cellPhone,
      residencesType: doc.residencesType,
      neighborhood: doc.neighborhood,
      company: doc.company,
      workplace: doc.workplace,
      specialty: doc.specialty,
      photo: doc.photo,
    };
    return new Employee(employeeProps);
  }
  
  // Helper to map domain Employee entity to a plain object for Mongoose
  // CORREGIDO: Ahora incluye TODOS los campos requeridos
  private toMongooseData(employee: Employee): Partial<IEmployeeDocument> {
    const data: Partial<IEmployeeDocument> = {
      _id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName, 
      email: typeof employee.email === 'string' ? employee.email : (employee.email as { toString: () => string })?.toString() ?? '',
      position: typeof employee.position === 'string' ? employee.position : (employee.position as { toString: () => string })?.toString() ?? '',
      address: employee.address,
      cellPhone: employee.cellPhone,
      residencesType: employee.residencesType,
      neighborhood: employee.neighborhood,
      company: employee.company,
      workplace: employee.workplace,
      specialty: employee.specialty,
    };
    
    if (employee.secondName !== undefined) data.secondName = employee.secondName;
    if (employee.landline !== undefined) data.landline = employee.landline;
    if (employee.descriptionResidence !== undefined) data.descriptionResidence = employee.descriptionResidence;
    if (employee.photo !== undefined) data.photo = employee.photo;
    
    return data;
  }
  
  private toMongooseUpdateData(employeeData: Partial<EmployeeProps>): Partial<IEmployeeDocument> {
    const data: Partial<IEmployeeDocument> = {};
    
    // List of direct assignments for string or simple types
    const directFields: (keyof EmployeeProps)[] = [
      'firstName', 'lastName', 'secondName', 'landline', 'descriptionResidence',
      'address', 'cellPhone', 'residencesType', 'neighborhood', 'company', 'workplace', 
      'photo', 'specialty'
    ];
    
    for (const field of directFields) {
      if (employeeData[field] !== undefined) {
        (data as any)[field] = employeeData[field];
      }
    }
    
    // Special handling for email and position
    if (employeeData.email !== undefined) {
      data.email = typeof employeeData.email === 'string'
      ? employeeData.email
      : employeeData.email?.toString() || '';
    }
    if (employeeData.position !== undefined) {
      data.position = typeof employeeData.position === 'string'
      ? employeeData.position
      : (employeeData.position as { toString: () => string })?.toString() ?? '';
    }
    
    return data;
  }
  
  // Finds employees with position "Doctor" by their IDs
  async findDoctorsByIds(ids: string[]): Promise<Employee[]> {
    const doctorDocs = await EmployeeModel.find({
      _id: { $in: ids },
      position: 'DOCTOR'
    });
    const doctors = doctorDocs.map(doc => this.toDomainEntity(doc));
    logger.info(`Found ${doctors.length} doctors for IDs: ${ids.join(', ')}`);
    return doctors;
  }

  async save(employee: Employee): Promise<Employee> {
    logger.info('Saving employee:', employee);    
    const newEmployee = new EmployeeModel(this.toMongooseData(employee));   
    const savedDoc = await newEmployee.save();
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
    const updatedDoc = await EmployeeModel.findByIdAndUpdate(employeeId, this.toMongooseUpdateData(employeeData), { new: true });
    if (!updatedDoc) return null;
    return this.toDomainEntity(updatedDoc);
  }

  async delete(employeeId: string): Promise<boolean> {
    const result = await EmployeeModel.findByIdAndDelete(employeeId);
    return !!result;
  }
}