import { Sequelize } from "sequelize";
import { applicationConfig } from "../config/configLoader";

const { postgresUser, postgresPassword, postgresDatabase } = applicationConfig;
export const dbConnection = new Sequelize(postgresDatabase, postgresUser, postgresPassword, { dialect: "postgres", logging: false });