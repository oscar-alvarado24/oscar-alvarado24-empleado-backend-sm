// src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './infrastructure/database/connect'; // Assuming connect.ts exports a default function
import employeeRoutes from './infrastructure/web/express/routes/employeeRoutes';
import { EmployeeController } from './infrastructure/web/express/controllers/EmployeeController';
import { errorHandler } from './infrastructure/web/express/middlewares/errorHandler';

// Import Repositories
import { MongoEmployeeRepository } from './infrastructure/database/mongodb/repositories/MongoEmployeeRepository';

// Import Use Cases
import { CreateEmployee } from './application/use_cases/CreateEmployee';
import { GetEmployeeById } from './application/use_cases/GetEmployeeById';
import { GetAllEmployees } from './application/use_cases/GetAllEmployees';
import { UpdateEmployee } from './application/use_cases/UpdateEmployee';
import { DeleteEmployee } from './application/use_cases/DeleteEmployee';

// Load environment variables
dotenv.config();

import { logger } from './config/logger'; // Import logger

const app: Express = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // For parsing application/json

// Request Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

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
// The employeeRoutes function now expects an EmployeeController instance
app.use('/api/v1/employees', employeeRoutes(employeeController));

// Global Error Handler Middleware (should be last middleware)
app.use(errorHandler);

export default app;
