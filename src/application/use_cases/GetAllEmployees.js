// src/application/use_cases/GetAllEmployees.js
class GetAllEmployees {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async execute() {
    return this.employeeRepository.findAll();
  }
}

module.exports = GetAllEmployees;
