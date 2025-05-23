// src/domain/repositories/EmployeeRepository.js

// This is an abstract class/interface and should not be instantiated directly.
// Concrete implementations will provide the actual logic.
class EmployeeRepository {
  async save(employee) {
    throw new Error('Method not implemented');
  }

  async findById(employeeId) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async update(employeeId, employeeData) {
    throw new Error('Method not implemented');
  }

  async delete(employeeId) {
    throw new Error('Method not implemented');
  }
}

module.exports = EmployeeRepository;
