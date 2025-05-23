"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../../../../config/logger"); // Import logger
function errorHandler(err, req, res, next) {
    if (Array.isArray(err) && err.length > 0 && 'property' in err[0] && 'constraints' in err[0]) {
        // This is an array of class-validator errors
        logger_1.logger.error('Validation errors occurred:', {
            count: err.length,
            errors: err.map((e) => ({
                property: e.property,
                constraints: e.constraints,
                children: e.children, // Log children if they exist
            })),
            requestPath: req.path,
            requestMethod: req.method,
        });
    }
    else {
        // This is a general AppError or other Error type
        const appErr = err; // Cast to AppError to access its properties
        logger_1.logger.error(`Error handled: ${appErr.message || 'Unknown error'}`, {
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
        const formattedErrors = err.map((error) => {
            var _a;
            return ({
                property: error.property,
                constraints: error.constraints,
                children: (_a = error.children) === null || _a === void 0 ? void 0 : _a.map(child => ({
                    property: child.property,
                    constraints: child.constraints,
                }))
            });
        });
        // No return here, just send the response
        res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Validation failed',
            errors: formattedErrors,
        });
    }
    // Ensure err is treated as AppError for the rest of the handler
    const appErr = err; // This cast is potentially unsafe if err is ClassValidationError[]
    let statusCode = 500;
    let responseMessage = 'Internal Server Error';
    let additionalDetails = {};
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
        responseMessage = Object.values(appErr.errors).map((e) => e.message).join(', ');
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
//# sourceMappingURL=errorHandler.js.map