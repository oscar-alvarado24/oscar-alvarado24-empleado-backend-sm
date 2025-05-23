// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./infrastructure/database/connect');
const employeeRoutes = require('./infrastructure/web/express/routes/employeeRoutes');
const EmployeeController = require('./infrastructure/web/express/controllers/EmployeeController');
const errorHandler = require('./infrastructure/web/express/middlewares/errorHandler');

// Import Repositories
const MongoEmployeeRepository = require('./infrastructure/database/mongodb/repositories/MongoEmployeeRepository');

// Import Use Cases
const CreateEmployee = require('./application/use_cases/CreateEmployee');
const GetEmployeeById = require('./application/use_cases/GetEmployeeById');
const GetAllEmployees = require('./application/use_cases/GetAllEmployees');
const UpdateEmployee = require('./application/use_cases/UpdateEmployee');
const DeleteEmployee = require('./application/use_cases/DeleteEmployee');

// Load environment variables (though server.js might also do this, it's good to ensure it's done before DB connection)
dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // For parsing application/json

// Instantiate Repository
const employeeRepository = new MongoEmployeeRepository();

// Instantiate Use Cases
const createEmployeeUseCase = new CreateEmployee(employeeRepository);
const getEmployeeByIdUseCase = new GetEmployeeById(employeeRepository);
const getAllEmployeesUseCase = new GetAllEmployees(employeeRepository);
const updateEmployeeUseCase = new UpdateEmployee(employeeRepository);
const deleteEmployeeUseCase = new DeleteEmployee(employeeRepository);

// Instantiate Controller
const employeeController = new EmployeeController(
  createEmployeeUseCase,
  getEmployeeByIdUseCase,
  getAllEmployeesUseCase,
  updateEmployeeUseCase,
  deleteEmployeeUseCase
);

// Routes
app.use('/api/v1/employees', employeeRoutes(employeeController)); // Pass controller to the router function

// Global Error Handler Middleware (should be last middleware)
app.use(errorHandler);

module.exports = app;
