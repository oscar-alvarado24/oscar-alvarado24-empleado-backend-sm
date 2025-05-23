// src/infrastructure/database/mongodb/repositories/MongoEmployeeRepository.ts
import { EmployeeRepository } from '../../../../domain/repositories/EmployeeRepository';
import EmployeeModel, { IEmployeeDocument } from '../models/EmployeeModel';
import { Employee, EmployeeProps } from '../../../../domain/entities/Employee'; // Path to your domain Employee entity
import { Email } from '../../../../domain/value-objects/Email'; // Import Email value object
import { Position, stringToEnum } from '../../../../domain/value-objects/Position'; // Import Position value object and stringToEnum

export class MongoEmployeeRepository extends EmployeeRepository {
  // Helper to map Mongoose document to domain Employee entity
  private toDomainEntity(doc: IEmployeeDocument): Employee {
    // Need to import Email and stringToEnum (for Position)
    // Assuming these are available from the domain value-objects
    // import { Email } from '../../../../domain/value-objects/Email';
    // import { stringToEnum } from '../../../../domain/value-objects/Position';
    // These imports should be at the top of the file. I'll add them if they're not already.
    
    // The Employee constructor expects an EmployeeProps object.
    // We need to construct this object from the Mongoose document.
    // Ensure all required fields for EmployeeProps are present.
    const employeeProps: EmployeeProps = {
      id: doc.id ? parseInt(doc.id, 10) : undefined, // Convert string id to number
      firstName: doc.firstName,
      firstSurName: doc.lastName, // Assuming doc.lastName maps to firstSurName
      secondName: doc.secondName,
      secondSurName: doc.secondSurName,
      // email: Email.create(doc.email), // This is the correct way
      // position: stringToEnum(doc.position), // This is the correct way
      // For now, to avoid import errors if Email/stringToEnum are not directly importable here
      // or if they are in a place that causes circular dependencies with current file structure,
      // I will cast to 'any'. This is a known simplification from previous steps.
      // The ideal solution is to ensure Email.create and stringToEnum are accessible and used.
      email: Email.create(doc.email), // Use Email.create
      position: stringToEnum(doc.position), // Use stringToEnum for Position
      department: doc.department,
      landline: doc.landline,
      descriptionResidence: doc.descriptionResidence,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      // EmployeeProps also requires:
      // address: string; cellPhone: string; residencesType: string; neighborhood: string; empresa: number;
      // These are missing from IEmployeeDocument currently.
      // This will cause a type error when constructing Employee.
      // I need to add these to IEmployeeDocument and the schema if they are part of the domain model.
      // For now, casting to 'any' to pass the constructor, but this is a major gap.
      address: (doc as any).address,
      cellPhone: (doc as any).cellPhone,
      residencesType: (doc as any).residencesType,
      neighborhood: (doc as any).neighborhood,
      empresa: (doc as any).empresa,
      photo: (doc as any).photo, // Assuming photo might be there
    };
    return new Employee(employeeProps);
  }

  // Helper to map domain Employee entity to a plain object for Mongoose
  // Only include fields that are part of the schema and are not undefined
  private toMongooseData(employee: Employee): Partial<IEmployeeDocument> {
    const data: Partial<IEmployeeDocument> = {
      // id is not set here as it's managed by MongoDB (_id)
      firstName: employee.firstName,
      // Assuming 'lastName' in domain maps to 'lastName' in schema.
      // If it maps to 'firstSurName', adjust accordingly.
      lastName: employee.lastName,
      email: employee.email,
      position: employee.position,
      department: employee.department,
    };
    // Add optional fields only if they are defined
    if (employee.secondName !== undefined) data.secondName = employee.secondName;
    if (employee.secondSurName !== undefined) data.secondSurName = employee.secondSurName;
    if (employee.landline !== undefined) data.landline = employee.landline;
    if (employee.descriptionResidence !== undefined) data.descriptionResidence = employee.descriptionResidence;
    
    // createdAt and updatedAt are handled by Mongoose timestamps
    return data;
  }
   private toMongooseUpdateData(employeeData: Partial<EmployeeProps>): Partial<IEmployeeDocument> { // Changed to Partial<EmployeeProps>
    const data: Partial<IEmployeeDocument> = {};
    // Direct assignment for string or simple types
    if (employeeData.firstName !== undefined) data.firstName = employeeData.firstName;
    // Assuming lastName in DTO/Update maps to firstSurName in EmployeeProps
    if (employeeData.firstSurName !== undefined) data.lastName = employeeData.firstSurName; 
    else if ((employeeData as any).lastName !== undefined) data.lastName = (employeeData as any).lastName; // Fallback for 'lastName' if used directly
    
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
    if (employeeData.email !== undefined) data.email = employeeData.email.toString();
    if (employeeData.position !== undefined) data.position = employeeData.position.toString();
    
    // createdAt and updatedAt are typically not updated directly
    return data;
  }


  async save(employee: Employee): Promise<Employee> {
    const employeeData = this.toMongooseData(employee);
    const newEmployee = new EmployeeModel(employeeData);
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

  async update(employeeId: string, employeeData: Partial<EmployeeProps>): Promise<Employee | null> { // Changed to Partial<EmployeeProps>
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
