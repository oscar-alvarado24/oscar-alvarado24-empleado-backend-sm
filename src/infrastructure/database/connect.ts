// src/infrastructure/database/connect.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../../config/logger'; // Adjusted path for logger

// Ensure environment variables are loaded.
// dotenv.config() might have been called in server.ts or app.ts already.
// If not, or to be safe, you can call it here.
// However, it's generally better to have it loaded once at the application entry point.
// For this exercise, assuming it's loaded by server.ts/app.ts.
// If you encounter issues with process.env.MONGODB_URI being undefined, ensure dotenv.config() is called before this file is executed.

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      logger.error('MongoDB Connection Error: MONGODB_URI is not defined in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true, // Deprecated in Mongoose 6+
      // useUnifiedTopology: true, // Deprecated in Mongoose 6+
      // useCreateIndex: true, // No longer supported
      // useFindAndModify: false // No longer supported
      // Mongoose 6+ uses these defaults, so no specific options are needed for basic connection.
      // You can add other options here if required, e.g., for replica sets, SSL, etc.
    });
    logger.info('MongoDB Connected Successfully...');
  } catch (err: any) { // Catching as 'any' for broad error compatibility
    logger.error('MongoDB Connection Error:', { message: err.message, stack: err.stack });
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
