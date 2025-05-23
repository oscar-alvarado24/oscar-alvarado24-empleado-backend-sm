// src/infrastructure/database/mongodb/models/EmployeeModel.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  department: { type: String }, // Department can be optional
  // Mongoose adds _id automatically, which we can use as our primary id
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Employee', employeeSchema);
