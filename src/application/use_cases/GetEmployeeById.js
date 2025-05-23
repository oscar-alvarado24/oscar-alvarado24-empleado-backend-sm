// src/application/use_cases/GetEmployeeById.js
class GetEmployeeById {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async execute(employeeId) {
    return this.employeeRepository.findById(employeeId);
  }
}

module.exports = GetEmployeeById;
