import { EmployeeRepository } from "../spi/IEmployeeRepository"; // This is the SPI version of EmployeeRepository
import { Employee } from "../entities/Employee"; // Changed from EmployeeEntity to Employee
import { SESService } from "../spi/ISes";
import { CognitoService } from "../spi/ICognitoService";
import { EmployeeServicePort } from "../api/IEmployeeServicePort";
import { logger } from "../../config/logger";

export class EmployeeUseCase implements EmployeeServicePort {
    constructor(
      private readonly employeeRepository: EmployeeRepository,
      private readonly sesService: SESService,
      private readonly cognitoService: CognitoService
    ) {}
  
    async createEmployee(employee: Employee) { // Changed from EmployeeEntity to Employee
      try {
        return await this.employeeRepository.create(employee); // This employeeRepository is the SPI version
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error creating employee: ${error.message}`);
        } else {
          console.error(`Error creating employee: ${String(error)}`);
        }
        
        await this.rollback(employee, error);
        
        throw error;
      }
    }
  
    private async rollback(employee: Employee, error: any): Promise<void> { // Changed from EmployeeEntity to Employee
      if (error.message.includes("Mongo")) {
        try {
          await this.cognitoService.deleteCognitoUser(employee.email.toString()); // Assuming email is a Value Object
        } catch (rollbackError) {
          if (rollbackError instanceof Error) {
            console.error(`Rollback error: ${rollbackError.message}`);
          } else {
            console.error(`Rollback error: ${String(rollbackError)}`);
          }
        }
      }
    }
  }