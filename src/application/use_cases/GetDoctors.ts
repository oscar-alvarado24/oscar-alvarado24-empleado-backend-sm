import { EmployeeRepository } from "../../domain/repositories/EmployeeRepository";
import { logger } from "../../infrastructure/config/logger";
import { DataDoctorProcedure } from "../dtos/DataDoctorProcedure";
import { EmployeeMapper } from "../mapper/EmployeeMapper";

export class GetDoctors {
    constructor(private readonly employeeRepository: EmployeeRepository) {}

      async execute(ids: string[]): Promise<DataDoctorProcedure[]> {

        const doctors = await this.employeeRepository.findDoctorsByIds(ids);
        logger.info(`Found ${doctors.length} doctors for provided IDs ${ids.join(', ')}`);
        return EmployeeMapper.toDataDoctorProcedureList(doctors);
      }
}