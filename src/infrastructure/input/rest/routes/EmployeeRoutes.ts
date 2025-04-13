import { Router } from "express";
import { EmployeeController } from "../EmployeeController";

export const EmployeeRoutes = (
    employeeController: EmployeeController
  ) => {
    const router = Router();
    router.post(
        '/create',
        employeeController.create.bind(employeeController)
      );
  return router;
};