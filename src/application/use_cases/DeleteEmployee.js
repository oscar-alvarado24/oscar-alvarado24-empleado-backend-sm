// src/application/use_cases/DeleteEmployee.js
class DeleteEmployee {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async execute(employeeId) {
    return this.employeeRepository.delete(employeeId);
  }
}

module.exports = DeleteEmployee;
