import dotenv from 'dotenv';
import { cleanEnv, makeValidator, num, str } from 'envalid';

dotenv.config();

const stringNotEmpty = makeValidator((value: string) => {
    if (!value || value.length === 0) {
        throw new Error('Must not be empty');
    }
    return value;
});

const env = cleanEnv(process.env, {
    POSTGRES_USER: stringNotEmpty(),
    POSTGRES_PASSWORD: stringNotEmpty(),
    POSTGRES_DB: stringNotEmpty(),
    APPLICATION_PORT: num({ default: 3005 }),
    LOG_DIR: str({ default: '../logs' }),
    SECRET_KEY: stringNotEmpty(),
});

export interface AppConfig {
    postgresUser: string;
    postgresPassword: string;
    postgresDatabase: string;
    applicationPort: number;
    logDir: string;
    secretKey: string;
}

const getConfig = (): AppConfig => {
    return {
        postgresUser: env.POSTGRES_USER,
        postgresPassword: env.POSTGRES_PASSWORD,
        postgresDatabase: env.POSTGRES_DB,
        applicationPort: env.APPLICATION_PORT,
        logDir: env.LOG_DIR,
        secretKey: env.SECRET_KEY,
    };
}

export const applicationConfig = getConfig();