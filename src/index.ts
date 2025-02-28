import mongoose from 'mongoose';
import app, { logger } from './app';
import connectToDb from './helpers/DbConnect';

async function startServer() {
  try {
    await connectToDb(); // Connect once

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.debug('🛑 SIGINT received. Closing MongoDB connection...');
      await mongoose.disconnect();
      logger.debug('⚡ MongoDB Disconnected!');
      server.close(() => {
        logger.debug('💀 Server Stopped');
        process.exit(0);
      });
    });

    process.on('SIGTERM', async () => {
      logger.debug('🛑 SIGTERM received. Closing MongoDB connection...');
      await mongoose.disconnect();
      logger.debug('⚡ MongoDB Disconnected!');
      server.close(() => {
        logger.debug('💀 Server Stopped');
        process.exit(0);
      });
    });

    process.on('uncaughtException', (err) => {
      logger.error('🔥 Uncaught Exception:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
    });
  } catch (error) {
    logger.error('❌ Failed to Start Server:', error);
    process.exit(1);
  }
}

startServer();
