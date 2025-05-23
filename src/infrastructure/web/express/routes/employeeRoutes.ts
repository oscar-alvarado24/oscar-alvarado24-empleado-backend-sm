// src/infrastructure/web/express/routes/employeeRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { EmployeeController } from '../controllers/EmployeeController'; // Adjust path as necessary

export default (employeeController: EmployeeController): Router => {
  const router = Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => 
    employeeController.create(req, res, next)
  );

  router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
    employeeController.getById(req, res, next)
  );

  router.get('/', (req: Request, res: Response, next: NextFunction) =>
    employeeController.getAll(req, res, next)
  );

  router.put('/:id', (req: Request, res: Response, next: NextFunction) =>
    employeeController.update(req, res, next)
  );

  router.delete('/:id', (req: Request, res: Response, next: NextFunction) =>
    employeeController.delete(req, res, next)
  );

  return router;
};
