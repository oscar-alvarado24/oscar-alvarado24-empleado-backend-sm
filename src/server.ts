// src/server.ts
import dotenv from 'dotenv';
// Load environment variables from .env file at the very beginning
dotenv.config();

import app from './app'; // Assuming app.ts exports the express app as default
import http from 'http'; // Import http module for server instance
import { logger } from './config/logger'; // Import logger

const PORT: string | number = process.env.PORT || 3000;

const server: http.Server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${err.message}`, err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`, err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
