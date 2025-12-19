import { EmployeeRepository } from "../../domain/repositories/EmployeeRepository";
import { logger } from "../../infrastructure/config/logger";
import { DataDoctorProcedure } from "../dtos/DataDoctorProcedure";
import { EmployeeMapper } from "../mapper/EmployeeMapper";
import { CryptoService } from "../helper/CryptoService";
import { Employee } from "../../domain/entities/Employee";

export class GetDoctors {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly cryptoService: CryptoService) { }

  async execute(idsEncrypted: string): Promise<DataDoctorProcedure[]> {

    logger.debug(`Encrypted IDs received: ${idsEncrypted}`)
    const decryptedData = await this.cryptoService.decrypt(idsEncrypted);
    logger.debug(`Decrypted data: ${decryptedData}`);
    const ids: number[] = decryptedData
      .split(',')
      .map(id => Number(id.trim()))
      .filter(id => !isNaN(id) && id > 0); 

    const doctors = await this.employeeRepository.findDoctorsByIds(ids.map(id => id.toString()));
    logger.info(`Found ${doctors.length} doctors for provided IDs ${ids.join(', ')}`);
    
    return EmployeeMapper.toDataDoctorProcedureList(doctors, this.cryptoService);
  }
}