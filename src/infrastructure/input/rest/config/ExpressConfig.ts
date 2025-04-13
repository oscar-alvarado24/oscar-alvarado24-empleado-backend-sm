import express from 'express';
import { EmployeeController } from '../EmployeeController';
import { EmployeeHandler } from '../../../../applicaion/handler/EmployeeHandler';
import { EmployeeUseCase } from '../../../../domain/usecase/EmployeeUseCase';
import { EmployeeRoutes } from '../routes/EmployeeRoutes';

const cognitoService: CognitoService = new CognitoServiceImpl();
const sesService: SESService = new SESServiceImpl();
const employeeRepository: EmployeeRepository = new EmployeeRepositoryMongo();

// 2. Configurar caso de uso (servicio de dominio)
const employeeUseCase = new EmployeeUseCase(
  employeeRepository,
  sesService,
  cognitoService
);

// 3. Configurar handler (adaptador primario)
const employeeHandler = new EmployeeHandler(employeeUseCase);

// 4. Crear controlador HTTP
const employeeController = new EmployeeController(employeeHandler);

const app = express();

app.use(express.json());
app.use('/employees', EmployeeRoutes(employeeController));

app.listen(3000, () => {
  console.log('Servidor ejecutándose en puerto 3000');
});