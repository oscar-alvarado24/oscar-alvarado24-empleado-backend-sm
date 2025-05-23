// src/application/use_cases/UpdateEmployee.js
class UpdateEmployee {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async execute(employeeId, employeeDataToUpdate) {
    // You might want to fetch the employee first to ensure it exists,
    // or handle that within the repository.
    // Business logic for what can be updated can also go here.
    return this.employeeRepository.update(employeeId, employeeDataToUpdate);
  }
}

module.exports = UpdateEmployee;
