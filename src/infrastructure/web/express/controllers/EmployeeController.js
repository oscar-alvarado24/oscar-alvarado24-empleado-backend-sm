// src/infrastructure/web/express/controllers/EmployeeController.js

// These use cases will be injected, typically in app.js or a container
// For now, we define how they would be used if injected.
// Actual instantiation and injection will be handled in app.js.

class EmployeeController {
  constructor(createEmployeeUseCase, getEmployeeByIdUseCase, getAllEmployeesUseCase, updateEmployeeUseCase, deleteEmployeeUseCase) {
    this.createEmployeeUseCase = createEmployeeUseCase;
    this.getEmployeeByIdUseCase = getEmployeeByIdUseCase;
    this.getAllEmployeesUseCase = getAllEmployeesUseCase;
    this.updateEmployeeUseCase = updateEmployeeUseCase;
    this.deleteEmployeeUseCase = deleteEmployeeUseCase;
  }

  async create(req, res, next) {
    try {
      const employee = await this.createEmployeeUseCase.execute(req.body);
      res.status(201).json(employee);
    } catch (error) {
      next(error); // Pass error to the error handling middleware
    }
  }

  async getById(req, res, next) {
    try {
      const employee = await this.getEmployeeByIdUseCase.execute(req.params.id);
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const employees = await this.getAllEmployeesUseCase.execute();
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const employee = await this.updateEmployeeUseCase.execute(req.params.id, req.body);
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ message: 'Employee not found for update' });
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const success = await this.deleteEmployeeUseCase.execute(req.params.id);
      if (success) {
        res.status(204).send(); // No content
      } else {
        // This case might mean the employee was already deleted or never existed.
        // Depending on repo implementation, delete might not distinguish between "not found" and "error during delete".
        // For simplicity, we'll assume the repository's delete method returns false if not found or failed.
        res.status(404).json({ message: 'Employee not found or could not be deleted' });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmployeeController;
