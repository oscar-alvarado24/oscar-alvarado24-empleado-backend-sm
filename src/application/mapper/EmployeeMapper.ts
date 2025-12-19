import { Employee, EmployeeProps } from "../../domain/entities/Employee";
import { Email } from "../../domain/value-objects/Email";
import { stringToEnum } from "../../domain/value-objects/Position";
import { CreateEmployeeDto } from "../dtos/CreateEmployeeDto";
import { DataDoctorProcedure } from "../dtos/DataDoctorProcedure";
import { EmployeeResponse } from "../dtos/EmployeeResponse";
import { CryptoService } from "../helper/CryptoService";


export class EmployeeMapper {

    static toEmployeeFromCreateDto(employeeDto: CreateEmployeeDto): Employee {
        const employeeProps: EmployeeProps = {
            id: employeeDto.id,
            firstName: employeeDto.firstName,
            lastName: employeeDto.lastName,
            secondName: employeeDto.secondName,
            email: Email.create(employeeDto.email),
            position: stringToEnum(employeeDto.position),
            address: employeeDto.address,
            residencesType: employeeDto.residencesType,
            neighborhood: employeeDto.neighborhood,
            company: employeeDto.company,
            landline: employeeDto.landline,
            descriptionResidence: employeeDto.descriptionResidence,
            workplace: employeeDto.workplace,
            cellPhone: employeeDto.cellPhone,
            specialty: employeeDto.specialty,
        };
        return new Employee(employeeProps);
    }

    static toEmployeeResponse(employee: Employee): EmployeeResponse {
        return new EmployeeResponse({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            secondName: employee.secondName,
            email: employee.email,
            address: employee.address,
            landline: employee.landline,
            cellPhone: employee.cellPhone,
            residencesType: employee.residencesType,
            descriptionResidence: employee.descriptionResidence,
            neighborhood: employee.neighborhood,
            company: employee.company,
            photo: employee.photo,
            position: employee.position,
            workplace: employee.workplace,
            active: employee.active,
        });
    }

    static async toDataDoctorProcedure(employee: Employee, cryptoService: CryptoService): Promise<DataDoctorProcedure> {
        const name = employee.firstName + (employee.secondName ? ' ' + employee.secondName : '') + ' ' + employee.lastName;
        const id = await cryptoService.encrypt(employee.id.toString());
        const company = await cryptoService.encrypt(employee.company.toString())
        return new DataDoctorProcedure(
            id,
            name,
            company,
            employee.workplace,
            employee.specialty || ''
        );
    }

    static async toDataDoctorProcedureList(employees: Employee[], cryptoService: CryptoService): Promise<DataDoctorProcedure[]> {
        return Promise.all(
            employees.map(emp => this.toDataDoctorProcedure(emp, cryptoService))
        );
    }
}