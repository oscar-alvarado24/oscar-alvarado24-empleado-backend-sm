import { EmployeeRequest } from "../../../applicaion/dto/EmployeeRequest";
import { IEmployeeHandler } from "../../../applicaion/handler/IEmployeeHandler";
import { Request, Response, NextFunction } from "express";

export class EmployeeController {
  constructor(private readonly createEmployeeHandler: IEmployeeHandler) { }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeDTO: EmployeeRequest = {
        email: req.body.email,
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        firstSurName: req.body.firstSurName,
        secondSurName: req.body.secondSurName,
        address: req.body.address,
        landline: req.body.landline,
        cellPhone: req.body.cellPhone,
        residencesType: req.body.residencesType,
        descriptionResidence: req.body.descriptionResidence,
        neighborhood: req.body.neighborhood,
        position: req.body.position,
        empresa: req.body.empresa
      };

      // Pasar el DTO al handler
      const result = await this.createEmployeeHandler.createEmployee(employeeDTO);

      res.status(201).json({
        message: result
      });
    } catch (error) {
      next(error);
    }
  }
}


