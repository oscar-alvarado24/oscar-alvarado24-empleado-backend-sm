// src/infrastructure/web/express/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

// Interface for common error properties
interface AppError extends Error {
  statusCode?: number;
  code?: number; // For Mongoose duplicate key errors
  keyValue?: { [key: string]: any }; // For Mongoose duplicate key errors
  errors?: { [key: string]: { message: string } }; // For Mongoose validation errors
  kind?: string; // For Mongoose CastError
  value?: any; // For Mongoose CastError
  path?: string; // For Mongoose CastError (added this)
}

// Interface for class-validator ValidationError
interface ClassValidationError {
  property: string;
  constraints?: { [type: string]: string };
  children?: ClassValidationError[];
}

import { logger } from '../../../../config/logger'; // Import logger

export function errorHandler(err: AppError | ClassValidationError[], req: Request, res: Response, next: NextFunction): void { // Return type void
  if (Array.isArray(err) && err.length > 0 && 'property' in err[0] && 'constraints' in err[0]) {
    // This is an array of class-validator errors
    logger.error('Validation errors occurred:', {
      count: err.length,
      errors: err.map((e: ClassValidationError) => ({
        property: e.property,
        constraints: e.constraints,
        children: e.children, // Log children if they exist
      })),
      requestPath: req.path,
      requestMethod: req.method,
    });
  } else {
    // This is a general AppError or other Error type
    const appErr = err as AppError; // Cast to AppError to access its properties
    logger.error(`Error handled: ${appErr.message || 'Unknown error'}`, {
      stack: appErr.stack,
      statusCode: appErr.statusCode,
      name: appErr.name,
      path: appErr.path, // Mongoose CastError path
      code: appErr.code, // Mongoose duplicate key error code
      keyValue: appErr.keyValue, // Mongoose duplicate key error keyValue
      mongooseErrors: appErr.errors, // Mongoose validation errors
      requestPath: req.path,
      requestMethod: req.method,
    });
  }

  // Handle class-validator errors (passed as an array from the controller)
  if (Array.isArray(err) && err.length > 0 && 'property' in err[0] && 'constraints' in err[0]) {
    // This check is a bit heuristic, a more robust check would be `err[0] instanceof ValidationError`
    // but that requires importing ValidationError from class-validator here.
    // For simplicity, we're duck-typing.
    const formattedErrors = err.map((error: ClassValidationError) => ({
      property: error.property,
      constraints: error.constraints,
      children: error.children?.map(child => ({ // Handle nested errors if any
        property: child.property,
        constraints: child.constraints,
      }))
    }));
    // No return here, just send the response
    res.status(400).json({ 
      status: 'error',
      statusCode: 400,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  
  // Ensure err is treated as AppError for the rest of the handler
  const appErr = err as AppError; // This cast is potentially unsafe if err is ClassValidationError[]

  let statusCode = 500;
  let responseMessage = 'Internal Server Error';
  let additionalDetails: any = {};

  if (appErr.statusCode) {
    statusCode = appErr.statusCode;
  }
  if (appErr.message) {
    responseMessage = appErr.message;
  }
  
  // Handle Mongoose validation errors (err.name === 'ValidationError' is a Mongoose specific error)
  if (appErr.name === 'ValidationError' && appErr.errors) {
    statusCode = 400; // Bad Request
    // Ensure appErr.errors is correctly typed before using Object.values
    // It should be { [path: string]: NativeError & { message: string } }
    responseMessage = Object.values(appErr.errors).map((e: any) => e.message).join(', ');
    additionalDetails.mongooseValidation = true;
  }

  // Handle Mongoose duplicate key errors (e.g., unique email constraint)
  if (appErr.code === 11000 && appErr.keyValue) {
    statusCode = 409; // Conflict
    const field = Object.keys(appErr.keyValue)[0];
    responseMessage = `Duplicate field value entered for: ${field}. Please use another value.`; // Corrected to responseMessage
  }
  
  // Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (appErr.name === 'CastError' && appErr.kind === 'ObjectId') {
    statusCode = 400; // Bad Request
    responseMessage = `Invalid ID format for field ${appErr.path}: ${appErr.value}`; // Corrected to responseMessage
  }

  // Default error response if none of the specific handlers caught it
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: responseMessage, // Ensure this uses responseMessage
    // Optionally, include stack trace in development
    // stack: process.env.NODE_ENV === 'development' ? appErr.stack : undefined, // Use appErr.stack
    details: Object.keys(additionalDetails).length > 0 ? additionalDetails : undefined // Added details back
  });
}
