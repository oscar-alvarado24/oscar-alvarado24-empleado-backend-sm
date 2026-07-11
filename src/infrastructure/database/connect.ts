import mongoose from 'mongoose';
import { logger } from '../config/logger';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async (): Promise<void> => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_DB_NAME } = process.env;

    if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_CLUSTER || !MONGODB_DB_NAME) {
      logger.error('MongoDB Connection Error: missing environment variables');
      process.exit(1);
    }

    const mongoURI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/${MONGODB_DB_NAME}?retryWrites=true&w=majority&appName=employee-microservice`;

    logger.debug(`Connecting to cluster: ${MONGODB_CLUSTER}, db: ${MONGODB_DB_NAME}`);

    await mongoose.connect(mongoURI);
    logger.info('MongoDB Connected Successfully...');
  } catch (err: any) {
    logger.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
