import 'reflect-metadata';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import EnvHelper from '../helpers/EnvHelper';

export const dataSourceOptions: DataSourceOptions = {

  // @ts-ignore
  type: EnvHelper.getEnv('DB_DRIVER', 'postgres'),
  host: EnvHelper.getEnv('DB_HOST', 'localhost'),
  port: +EnvHelper.getEnv('DB_PORT', '5432'),
  username: EnvHelper.getEnv('DB_USER', 'root'),
  password: EnvHelper.getEnv('DB_PASSWORD', 'changeme'),
  database: EnvHelper.getEnv('DB_NAME', 'test'),
  logging: EnvHelper.getEnv('NODE_ENV', 'prod') === 'dev' ? true : false,
  entities: [resolve(__dirname, '../database/**/entities/*.{ts,js}')],
  migrations: [resolve(__dirname, '../database/**/migrations/*.ts')],
  synchronize: EnvHelper.getEnv('NODE_ENV', 'prod') === 'dev' ? true : false,
  migrationRun: true,
};

export const AppDataSource: DataSource = new DataSource(dataSourceOptions);
