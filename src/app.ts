import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './infrastructure/database/connect';
import employeeRoutes from './infrastructure/output/web/express/routes/employeeRoutes';
import { EmployeeController } from './infrastructure/output/web/express/controllers/EmployeeController';
import { errorHandler } from './infrastructure/output/web/express/middlewares/errorHandler';

// Load environment variables
dotenv.config();

import { corsOptions, corsDevOptions, helmetOptions, simpleRateLimit } from './infrastructure/output/web/express/middlewares/security';

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
import { CryptoService } from './application/helper/CryptoService'

const app: Express = express();

// Connect to Database
connectDB();

// ====================================
// HEALTH CHECK (Sin middlewares de seguridad)
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

// ====================================
// MIDDLEWARES GLOBALES (Excluyen /health)
// ====================================

const excludeHealthPath = (middleware: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/health') {
      return next();
    }
    return middleware(req, res, next);
  };
};

// Determinar CORS según ambiente
const activeCorsOptions = process.env.NODE_ENV === 'development'
  ? corsDevOptions
  : corsOptions;

// 1. Helmet
app.use(excludeHealthPath(helmet(helmetOptions)));

// 2. CORS - Maneja automáticamente OPTIONS
app.use(excludeHealthPath(cors(activeCorsOptions)));

// 3. OPTIONS explícito (por si acaso)
app.options('/{*path}', excludeHealthPath(cors(activeCorsOptions)));

if (process.env.NODE_ENV === 'development') {
  logger.info('🔓 CORS: Development mode (permissive)');
} else {
  logger.info('🔒 CORS: Production mode (restrictive)');
}
// 4. Rate Limiting - Aplicar a todas excepto /health
const rateLimitWindow = 15 * 60 * 1000; // 15 minutos
const rateLimitMax = process.env.NODE_ENV === 'development' ? 1000 : 100;

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/health') {
    return next();
  }
  simpleRateLimit(rateLimitWindow, rateLimitMax)(req, res, next);
});

app.use(express.json({
  limit: '10mb',
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
// BUSINESS LOGIC
// ====================================

// Instantiate Repository
const employeeRepository = new MongoEmployeeRepository();

try {
  const cryptoService = new CryptoService(process.env.CRYPTO_SECRET_KEY!);

  // Instantiate Use Cases
  const createEmployeeUseCase = new CreateEmployee(employeeRepository);
  const getEmployeeByIdUseCase = new GetEmployeeById(employeeRepository);
  const getAllEmployeesUseCase = new GetAllEmployees(employeeRepository);
  const updateEmployeeUseCase = new UpdateEmployee(employeeRepository);
  const deleteEmployeeUseCase = new DeleteEmployee(employeeRepository);
  const getDoctorsByIdListUseCase = new GetDoctors(employeeRepository, cryptoService);

  // Instantiate Controller
  const employeeController = new EmployeeController(
    createEmployeeUseCase,
    getEmployeeByIdUseCase,
    getAllEmployeesUseCase,
    updateEmployeeUseCase,
    deleteEmployeeUseCase,
    getDoctorsByIdListUseCase
  );

  // ====================================
  // ROUTES
  // ====================================

  app.use((req, res, next) => {
  logger.debug('Incoming request', {
    method: req.method,
    originalUrl: req.originalUrl,
    path: req.path,
    baseUrl: req.baseUrl,
    headers: req.headers, // objeto real, no JSON.stringify
  });
  next();
});
  app.use('/api/v1/employee', employeeRoutes(employeeController));

  // 404 Handler
  app.use('/{*path}', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

  // Error Handler
  app.use(errorHandler);

} catch (error) {
  logger.error('Fatal error during initialization:', error);
  console.error(error);
  process.exit(1);
}

export default app;