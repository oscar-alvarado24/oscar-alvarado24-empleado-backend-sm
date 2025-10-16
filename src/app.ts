import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './infrastructure/database/connect';
import employeeRoutes from './infrastructure/web/express/routes/employeeRoutes';
import { EmployeeController } from './infrastructure/web/express/controllers/EmployeeController';
import { errorHandler } from './infrastructure/web/express/middlewares/errorHandler';

// Load environment variables
dotenv.config();

import { corsOptions, corsDevOptions, helmetOptions, simpleRateLimit } from './infrastructure/web/express/middlewares/security';


// Import Repositories
import { MongoEmployeeRepository } from './infrastructure/database/mongodb/repositories/MongoEmployeeRepository';

// Import Use Cases
import { CreateEmployee } from './application/use_cases/CreateEmployee';
import { GetEmployeeById } from './application/use_cases/GetEmployeeById';
import { GetAllEmployees } from './application/use_cases/GetAllEmployees';
import { UpdateEmployee } from './application/use_cases/UpdateEmployee';
import { DeleteEmployee } from './application/use_cases/DeleteEmployee';
import { GetDoctors } from './application/use_cases/GetDoctors';

import { logger } from './infrastructure/config/logger'; 

const app: Express = express();

// Connect to Database
connectDB();

app.use(helmet(helmetOptions));

// 2. CORS - Cross Origin Resource Sharing
if (process.env.NODE_ENV === 'development') {
  app.use(cors(corsDevOptions)); // Más permisivo en desarrollo
  logger.info('🔓 CORS: Development mode (permissive)');
} else {
  app.use(cors(corsOptions)); // Restrictivo en producción
  logger.info('🔒 CORS: Production mode (restrictive)');
}

// 3. Rate Limiting
const rateLimitWindow = 15 * 60 * 1000; // 15 minutos
const rateLimitMax = process.env.NODE_ENV === 'development' ? 1000 : 100;
app.use(simpleRateLimit(rateLimitWindow, rateLimitMax));

app.use(express.json({ 
  limit: '10mb', // Limitar tamaño de payload
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// ====================================
// LOGGING MIDDLEWARE
// ====================================
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')?.substring(0, 100) || 'unknown',
    };

    if (res.statusCode >= 400) {
      logger.warn('Request completed with error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
});

// ====================================
// HEALTH CHECK (Sin autenticación)
// ====================================
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'employees-microservice',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Instantiate Repository
const employeeRepository = new MongoEmployeeRepository();

// Instantiate Use Cases
const createEmployeeUseCase = new CreateEmployee(employeeRepository);
const getEmployeeByIdUseCase = new GetEmployeeById(employeeRepository);
const getAllEmployeesUseCase = new GetAllEmployees(employeeRepository);
const updateEmployeeUseCase = new UpdateEmployee(employeeRepository);
const deleteEmployeeUseCase = new DeleteEmployee(employeeRepository);
const getDoctorsByIdListUseCase = new GetDoctors(employeeRepository);
// Instantiate Controller
const employeeController = new EmployeeController(
  createEmployeeUseCase,
  getEmployeeByIdUseCase,
  getAllEmployeesUseCase,
  updateEmployeeUseCase,
  deleteEmployeeUseCase,
  getDoctorsByIdListUseCase
);

app.use('/api/v1/employee', employeeRoutes(employeeController));
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});
app.use(errorHandler);

export default app;
