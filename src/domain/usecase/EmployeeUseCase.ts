import { EmployeeRepository } from "../spi/IEmployeeRepository";
import { EmployeeEntity } from "../entities/Employee";
import { SESService } from "../spi/ISes";
import { CognitoService } from "../spi/ICognitoService";
import { EmployeeServicePort } from "../api/IEmployeeServicePort";

export class EmployeeUseCase implements EmployeeServicePort {
    constructor(
      private readonly employeeRepository: EmployeeRepository,
      private readonly sesService: SESService,
      private readonly cognitoService: CognitoService
    ) {}
  
    async createEmployee(employee: EmployeeEntity) {
      try {
        await this.sesService.registerEmailInSes(employee.email);

        await this.cognitoService.createCognitoUser(employee.email, employee.position);
  
        return await this.employeeRepository.create(employee);
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
  
    private async rollback(employee: EmployeeEntity, error: any): Promise<void> {
      if (error.message.includes("Mongo")) {
        try {
          await this.cognitoService.deleteCognitoUser(employee.email);
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