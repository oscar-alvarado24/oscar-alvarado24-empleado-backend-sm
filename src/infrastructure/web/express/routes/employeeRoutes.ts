// src/infrastructure/web/express/routes/employeeRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { EmployeeController } from '../controllers/EmployeeController'; 
import { authenticateCognitoToken, requireCognitoGroup } from '../middlewares/cognitoAuth';

export default (employeeController: EmployeeController): Router => {
  const router = Router();

  router.use(authenticateCognitoToken);
  router.post('/', requireCognitoGroup('pacientes'), (req: Request, res: Response, next: NextFunction) => 
    employeeController.create(req, res, next)
  );

  router.get('/:id', requireCognitoGroup('pacientes'), (req: Request, res: Response, next: NextFunction) =>
    employeeController.getById(req, res, next)
  );

  router.get('/', requireCognitoGroup('pacientes'), (req: Request, res: Response, next: NextFunction) =>
    employeeController.getAll(req, res, next)
  );

  router.put('/:id', requireCognitoGroup('pacientes'), (req: Request, res: Response, next: NextFunction) =>
    employeeController.update(req, res, next)
  );

  router.delete('/:id', (req: Request, res: Response, next: NextFunction) =>
    employeeController.delete(req, res, next)
  );

  router.get('/doctors/by-id-list', requireCognitoGroup('pacientes'), (req: Request, res: Response, next: NextFunction) =>
    employeeController.getDoctorsByIdList(req, res, next)
  );
  return router;
};
