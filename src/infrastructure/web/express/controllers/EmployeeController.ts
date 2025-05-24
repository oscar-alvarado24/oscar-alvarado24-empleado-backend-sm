// src/infrastructure/web/express/controllers/EmployeeController.ts
import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CreateEmployee } from '../../../../application/use_cases/CreateEmployee';
import { GetEmployeeById } from '../../../../application/use_cases/GetEmployeeById';
import { GetAllEmployees } from '../../../../application/use_cases/GetAllEmployees';
import { UpdateEmployee } from '../../../../application/use_cases/UpdateEmployee';
import { DeleteEmployee } from '../../../../application/use_cases/DeleteEmployee';
import { Employee } from '../../../../domain/entities/Employee'; // To type the result where appropriate
import { CreateEmployeeDto } from '../../../../application/dtos/CreateEmployeeDto';
import { UpdateEmployeeDto } from '../../../../application/dtos/UpdateEmployeeDto';
import { logger } from '../../../../config/logger'; // Import logger

export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployee,
    private readonly getEmployeeByIdUseCase: GetEmployeeById,
    private readonly getAllEmployeesUseCase: GetAllEmployees,
    private readonly updateEmployeeUseCase: UpdateEmployee,
    private readonly deleteEmployeeUseCase: DeleteEmployee
  ) {}

  // Helper to format validation errors
  private formatValidationErrors(errors: ValidationError[]): any {
    return errors.map(err => {
      return { property: err.property, constraints: err.constraints };
    });
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info(`POST /api/v1/employees - Request Body: ${JSON.stringify(req.body)}`);
    try {
      const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(createEmployeeDto);

      if (errors.length > 0) {
        logger.warn('Validation failed for create employee', { errors: this.formatValidationErrors(errors) });
        res.status(400).json({ 
          message: 'Validation failed', 
          errors: this.formatValidationErrors(errors) 
        });
        return;
      }

      const employee: Employee = await this.createEmployeeUseCase.execute(createEmployeeDto);
      logger.info(`Employee created successfully: ${employee.id}`);
      res.status(201).json(employee);
    } catch (error: any) {
      logger.error(`Error in create employee: ${error.message}`, error);
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const employeeId: string = req.params.id;
    logger.info(`GET /api/v1/employees/${employeeId}`);
    try {
      const employee: Employee | null = await this.getEmployeeByIdUseCase.execute(employeeId);
      if (employee) {
        logger.info(`Employee found: ${employeeId}`);
        res.status(200).json(employee);
      } else {
        logger.warn(`Employee not found: ${employeeId}`);
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error: any) {
      logger.error(`Error in get employee by ID ${employeeId}: ${error.message}`, error);
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('GET /api/v1/employees');
    try {
      const employees: Employee[] = await this.getAllEmployeesUseCase.execute();
      logger.info(`Retrieved ${employees.length} employees`);
      res.status(200).json(employees);
    } catch (error: any) {
      logger.error(`Error in get all employees: ${error.message}`, error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const employeeId: string = req.params.id;
    logger.info(`PUT /api/v1/employees/${employeeId} - Request Body: ${JSON.stringify(req.body)}`);
    try {
      const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, req.body);
      const errors = await validate(updateEmployeeDto);

      if (errors.length > 0) {
        logger.warn(`Validation failed for update employee ${employeeId}`, { errors: this.formatValidationErrors(errors) });
        res.status(400).json({ 
          message: 'Validation failed for update', 
          errors: this.formatValidationErrors(errors) 
        });
        return;
      }

      if (Object.keys(updateEmployeeDto).length === 0) {
        logger.warn(`No update data provided for employee ${employeeId}`);
        res.status(400).json({ message: 'No update data provided' });
        return;
      }
      
      const employee: Employee | null = await this.updateEmployeeUseCase.execute(employeeId, updateEmployeeDto);
      if (employee) {
        logger.info(`Employee updated successfully: ${employeeId}`);
        res.status(200).json(employee);
      } else {
        logger.warn(`Employee not found for update: ${employeeId}`);
        res.status(404).json({ message: 'Employee not found for update' });
      }
    } catch (error: any) {
      logger.error(`Error in update employee ${employeeId}: ${error.message}`, error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const employeeId: string = req.params.id;
    logger.info(`DELETE /api/v1/employees/${employeeId}`);
    try {
      const success: boolean = await this.deleteEmployeeUseCase.execute(employeeId);
      if (success) {
        logger.info(`Employee deleted successfully: ${employeeId}`);
        res.status(204).send();
      } else {
        logger.warn(`Employee not found for delete: ${employeeId}`);
        res.status(404).json({ message: 'Employee not found or could not be deleted' });
      }
    } catch (error: any) {
      logger.error(`Error in delete employee ${employeeId}: ${error.message}`, error);
      next(error);
    }
  }
}
