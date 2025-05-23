// src/infrastructure/web/express/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log error stack for debugging

  // Default to 500 server error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request
    // Collect specific validation messages
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Handle Mongoose duplicate key errors (e.g., unique email constraint)
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    // Extract the field that caused the duplicate error
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for: ${field}. Please use another value.`;
  }
  
  // Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400; // Bad Request
    message = `Invalid ID format: ${err.value}`;
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Optionally, include stack trace in development
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler;
