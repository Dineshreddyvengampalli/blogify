import mongoose from 'mongoose';
import config from './config';
import { logger } from '../app';

mongoose.connection.on('connected', () => {
  logger.info('🔗 Mongoose connected!');
});

mongoose.connection.on('disconnected', () => {
  logger.info('⚡ Mongoose disconnected!');
});

export default async function connectToDb() {
  if (mongoose.connection.readyState === 0) { // 0 = disconnected
    await mongoose.connect(config.mongoDB.connectionUrl);
    logger.info('✅ MongoDB Connected!');
  }
}
