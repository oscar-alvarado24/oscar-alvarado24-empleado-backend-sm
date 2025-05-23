// src/infrastructure/database/mongodb/repositories/MongoEmployeeRepository.js
const EmployeeRepository = require('../../../../domain/repositories/EmployeeRepository');
const EmployeeModel = require('../models/EmployeeModel');
const Employee = require('../../../../domain/entities/Employee');

class MongoEmployeeRepository extends EmployeeRepository {
  async save(employee) {
    const newEmployee = new EmployeeModel(employee);
    const saved = await newEmployee.save();
    return new Employee(saved.id, saved.firstName, saved.lastName, saved.email, saved.position, saved.department);
  }

  async findById(employeeId) {
    const employeeDoc = await EmployeeModel.findById(employeeId);
    if (!employeeDoc) return null;
    return new Employee(employeeDoc.id, employeeDoc.firstName, employeeDoc.lastName, employeeDoc.email, employeeDoc.position, employeeDoc.department);
  }

  async findAll() {
    const employeeDocs = await EmployeeModel.find();
    return employeeDocs.map(doc => new Employee(doc.id, doc.firstName, doc.lastName, doc.email, doc.position, doc.department));
  }

  async update(employeeId, employeeData) {
    const updatedDoc = await EmployeeModel.findByIdAndUpdate(employeeId, employeeData, { new: true });
    if (!updatedDoc) return null;
    return new Employee(updatedDoc.id, updatedDoc.firstName, updatedDoc.lastName, updatedDoc.email, updatedDoc.position, updatedDoc.department);
  }

  async delete(employeeId) {
    const result = await EmployeeModel.findByIdAndDelete(employeeId);
    return !!result; // Returns true if deletion was successful, false otherwise
  }
}

module.exports = MongoEmployeeRepository;
