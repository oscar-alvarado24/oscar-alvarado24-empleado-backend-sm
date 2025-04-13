import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../../applicaion/handler/exceptions/ValidationError";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    // Error de aplicación (traducido del dominio)
    res.status(400).json({
      error: err.message,
    });
  } else {
    // Errores no controlados
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};