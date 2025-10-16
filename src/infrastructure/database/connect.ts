import mongoose from 'mongoose';
import { logger } from '../config/logger'; 

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority&appName=ClusterEmployee`;
    if (!mongoURI) {
      logger.error('MongoDB Connection Error: MONGODB_URI is not defined in environment variables.');
      process.exit(1);
    }
    await mongoose.connect(mongoURI, {
      });
    logger.info('MongoDB Connected Successfully...');
  } catch (err: any) { 
    logger.error('MongoDB Connection Error:', { message: err.message, stack: err.stack });
    process.exit(1);
  }
};

export default connectDB;
