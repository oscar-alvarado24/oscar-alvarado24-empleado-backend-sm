"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = __importDefault(require("./infrastructure/database/connect")); // Assuming connect.ts exports a default function
const employeeRoutes_1 = __importDefault(require("./infrastructure/web/express/routes/employeeRoutes"));
const EmployeeController_1 = require("./infrastructure/web/express/controllers/EmployeeController");
const errorHandler_1 = require("./infrastructure/web/express/middlewares/errorHandler");
// Import Repositories
const MongoEmployeeRepository_1 = require("./infrastructure/database/mongodb/repositories/MongoEmployeeRepository");
// Import Use Cases
const CreateEmployee_1 = require("./application/use_cases/CreateEmployee");
const GetEmployeeById_1 = require("./application/use_cases/GetEmployeeById");
const GetAllEmployees_1 = require("./application/use_cases/GetAllEmployees");
const UpdateEmployee_1 = require("./application/use_cases/UpdateEmployee");
const DeleteEmployee_1 = require("./application/use_cases/DeleteEmployee");
// Load environment variables
dotenv_1.default.config();
const logger_1 = require("./config/logger"); // Import logger
const app = (0, express_1.default)();
// Connect to Database
(0, connect_1.default)();
// Middleware
app.use(express_1.default.json()); // For parsing application/json
// Request Logging Middleware
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    next();
});
// Instantiate Repository
const employeeRepository = new MongoEmployeeRepository_1.MongoEmployeeRepository();
// Instantiate Use Cases
const createEmployeeUseCase = new CreateEmployee_1.CreateEmployee(employeeRepository);
const getEmployeeByIdUseCase = new GetEmployeeById_1.GetEmployeeById(employeeRepository);
const getAllEmployeesUseCase = new GetAllEmployees_1.GetAllEmployees(employeeRepository);
const updateEmployeeUseCase = new UpdateEmployee_1.UpdateEmployee(employeeRepository);
const deleteEmployeeUseCase = new DeleteEmployee_1.DeleteEmployee(employeeRepository);
// Instantiate Controller
const employeeController = new EmployeeController_1.EmployeeController(createEmployeeUseCase, getEmployeeByIdUseCase, getAllEmployeesUseCase, updateEmployeeUseCase, deleteEmployeeUseCase);
// Routes
// The employeeRoutes function now expects an EmployeeController instance
app.use('/api/v1/employees', (0, employeeRoutes_1.default)(employeeController));
// Global Error Handler Middleware (should be last middleware)
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map