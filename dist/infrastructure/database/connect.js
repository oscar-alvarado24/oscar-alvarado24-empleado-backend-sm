"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/database/connect.ts
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../../config/logger"); // Adjusted path for logger
// Ensure environment variables are loaded.
// dotenv.config() might have been called in server.ts or app.ts already.
// If not, or to be safe, you can call it here.
// However, it's generally better to have it loaded once at the application entry point.
// For this exercise, assuming it's loaded by server.ts/app.ts.
// If you encounter issues with process.env.MONGODB_URI being undefined, ensure dotenv.config() is called before this file is executed.
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            logger_1.logger.error('MongoDB Connection Error: MONGODB_URI is not defined in environment variables.');
            process.exit(1);
        }
        yield mongoose_1.default.connect(mongoURI, {
        // useNewUrlParser: true, // Deprecated in Mongoose 6+
        // useUnifiedTopology: true, // Deprecated in Mongoose 6+
        // useCreateIndex: true, // No longer supported
        // useFindAndModify: false // No longer supported
        // Mongoose 6+ uses these defaults, so no specific options are needed for basic connection.
        // You can add other options here if required, e.g., for replica sets, SSL, etc.
        });
        logger_1.logger.info('MongoDB Connected Successfully...');
    }
    catch (err) { // Catching as 'any' for broad error compatibility
        logger_1.logger.error('MongoDB Connection Error:', { message: err.message, stack: err.stack });
        // Exit process with failure
        process.exit(1);
    }
});
exports.default = connectDB;
//# sourceMappingURL=connect.js.map