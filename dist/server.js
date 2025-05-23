"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file at the very beginning
dotenv_1.default.config();
const app_1 = __importDefault(require("./app")); // Assuming app.ts exports the express app as default
const logger_1 = require("./config/logger"); // Import logger
const PORT = process.env.PORT || 3000;
const server = app_1.default.listen(PORT, () => {
    logger_1.logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    logger_1.logger.error(`Unhandled Rejection at: ${promise}, reason: ${err.message}`, err);
    // Close server & exit process
    server.close(() => process.exit(1));
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger_1.logger.error(`Uncaught Exception: ${err.message}`, err);
    // Close server & exit process
    server.close(() => process.exit(1));
});
//# sourceMappingURL=server.js.map