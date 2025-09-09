import express from 'express';
import { logger } from './config/logger';
import { applicationConfig } from './config/configLoader';
import { initializeDatabaseConnection } from './database/initializeDatabaseConnection';
import { taskEndpoints } from './application/routes/task-endpoints';
import { userEndpoints } from './application/routes/user.endpoints';
import { tagEndpoints } from './application/routes/tag.endpoints';
import { taskLinkEndpoints } from './application/routes/task-link.endpoints';
import { taskTagEndpoints } from './application/routes/task-tag.endpoints';
import { authentication } from './application/middlewares/authentication';
import httpHelper from './application/routes/httpHelper';

// Express application
const application: express.Application = express();

// Middlewares
application.use(express.json());
application.use(express.urlencoded({ extended: true }));

// Health check endpoint
application.get('/health', async (req, res) => {
  httpHelper.sendOkResponse(res, { 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Munch Task Management API'
  });
});

// Routes
application.use('/tasks', authentication, taskEndpoints);
application.use('/users', userEndpoints);
application.use('/tags', authentication, tagEndpoints);
application.use('/task-links', authentication, taskLinkEndpoints);
application.use('/task-tags', authentication, taskTagEndpoints);

// Initialize database connection and start server
async function startServer() {
  try {
    await initializeDatabaseConnection();
    application.listen(applicationConfig.applicationPort, () => {
      logger.info(`=================================`);
      logger.info(`🚀 Munch Task Management listening on the port ${applicationConfig.applicationPort}`);
      logger.info(`=================================`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();