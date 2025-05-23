"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmployeeController_1 = require("../EmployeeController");
const EmployeeHandler_1 = require("../../../../applicaion/handler/EmployeeHandler");
const EmployeeUseCase_1 = require("../../../../domain/usecase/EmployeeUseCase");
const EmployeeRoutes_1 = require("../routes/EmployeeRoutes");
const cognitoService = new CognitoServiceImpl();
const sesService = new SESServiceImpl();
const employeeRepository = new EmployeeRepositoryMongo();
// 2. Configurar caso de uso (servicio de dominio)
const employeeUseCase = new EmployeeUseCase_1.EmployeeUseCase(employeeRepository, sesService, cognitoService);
// 3. Configurar handler (adaptador primario)
const employeeHandler = new EmployeeHandler_1.EmployeeHandler(employeeUseCase);
// 4. Crear controlador HTTP
const employeeController = new EmployeeController_1.EmployeeController(employeeHandler);
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use(express_1.default.json());
app.use('/employees', (0, EmployeeRoutes_1.EmployeeRoutes)(employeeController));
app.listen(3000, () => {
    console.log('Servidor ejecutándose en puerto 3000');
});
//# sourceMappingURL=ExpressConfig.js.map