import Database from "./models/index";
import { logger } from "../config/logger";
import { seedInitialData } from "./seedData";

export async function initializeDatabaseConnection() {
  try {
    await Database.sequelize.authenticate();
    logger.info('Database authentication successful');
    // Wait for sync to complete
    await Database.sequelize.sync({ force: false, alter: false });
    logger.info('Database sync completed successfully');
    // Seed initial data after tables are created
    await seedInitialData();
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error; 
  }
}