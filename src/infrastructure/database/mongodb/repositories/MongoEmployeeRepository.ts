import { EmployeeRepository } from '../../../../domain/repositories/EmployeeRepository';
import EmployeeModel, { IEmployeeDocument } from '../models/EmployeeModel';
import { Employee, EmployeeProps } from '../../../../domain/entities/Employee';
import { Email } from '../../../../domain/value-objects/Email';
import { stringToEnum } from '../../../../domain/value-objects/Position';
import { logger } from '../../../config/logger';
import { Types } from 'mongoose';

export class MongoEmployeeRepository extends EmployeeRepository {

  private toDomainEntity(doc: IEmployeeDocument): Employee {
    const employeeProps: EmployeeProps = {
      id: doc._id,
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

  private toMongooseData(employee: Employee): Partial<IEmployeeDocument> {
    // FIX: Genera nuevo ObjectId si employee.id no está definido
    const data: Partial<IEmployeeDocument> = {
      _id: employee.id ? Number(employee.id) : undefined,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: typeof employee.email === 'string'
        ? employee.email
        : (employee.email as { toString: () => string })?.toString() ?? '',
      position: typeof employee.position === 'string'
        ? employee.position
        : (employee.position as { toString: () => string })?.toString() ?? '',
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

    const directFields: (keyof EmployeeProps)[] = [
      'firstName', 'lastName', 'secondName', 'landline', 'descriptionResidence',
      'address', 'cellPhone', 'residencesType', 'neighborhood', 'company', 'workplace',
      'photo', 'specialty'
    ];

    for (const field of directFields) {
      if (employeeData[field] !== undefined) {
        (data as Record<string, unknown>)[field] = employeeData[field];
      }
    }

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

  async findDoctorsByIds(ids: string[]): Promise<Employee[]> {
    try {
      const numericIds = ids
      .map(id => Number(id))
      .filter(id => !isNaN(id));

    if (numericIds.length === 0) {
      logger.warn('findDoctorsByIds: no valid numeric IDs provided');
      return [];
    }

    const doctorDocs = await EmployeeModel.find({
      _id: { $in: numericIds },
      position: 'DOCTOR'
    });

    const doctors = doctorDocs.map(doc => this.toDomainEntity(doc));
    logger.info(`Found ${doctors.length} doctors for IDs: ${numericIds.join(', ')}`);
    return doctors;
    } catch (error) {
      logger.error('Error finding doctors by IDs:', error);
      throw error;
    }
  }

  async save(employee: Employee): Promise<Employee> {
    try {
      logger.info('Saving employee:', employee);
      const newEmployee = new EmployeeModel(this.toMongooseData(employee));
      const savedDoc = await newEmployee.save();
      return this.toDomainEntity(savedDoc);
    } catch (error) {
      logger.error('Error saving employee:', error);
      throw error;
    }
  }

  async findById(employeeId: string): Promise<Employee | null> {
    try {
      if (!Types.ObjectId.isValid(employeeId)) {
        logger.warn(`findById: invalid ObjectId "${employeeId}"`);
        return null;
      }

      const employeeDoc = await EmployeeModel.findById(employeeId);
      if (!employeeDoc) return null;
      return this.toDomainEntity(employeeDoc);
    } catch (error) {
      logger.error(`Error finding employee by id ${employeeId}:`, error);
      throw error;
    }
  }

  async findAll(): Promise<Employee[]> {
    try {
      const employeeDocs = await EmployeeModel.find();
      return employeeDocs.map(doc => this.toDomainEntity(doc));
    } catch (error) {
      logger.error('Error fetching all employees:', error);
      throw error;
    }
  }

  async update(employeeId: string, employeeData: Partial<EmployeeProps>): Promise<Employee | null> {
    try {
      if (!Types.ObjectId.isValid(employeeId)) {
        logger.warn(`update: invalid ObjectId "${employeeId}"`);
        return null;
      }

      const updatedDoc = await EmployeeModel.findByIdAndUpdate(
        employeeId,
        this.toMongooseUpdateData(employeeData),
        { new: true }
      );

      if (!updatedDoc) return null;
      return this.toDomainEntity(updatedDoc);
    } catch (error) {
      logger.error(`Error updating employee ${employeeId}:`, error);
      throw error;
    }
  }

  async delete(employeeId: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(employeeId)) {
        logger.warn(`delete: invalid ObjectId "${employeeId}"`);
        return false;
      }

      const result = await EmployeeModel.findByIdAndDelete(employeeId);
      return !!result;
    } catch (error) {
      logger.error(`Error deleting employee ${employeeId}:`, error);
      throw error;
    }
  }
}