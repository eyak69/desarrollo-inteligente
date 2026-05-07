import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'desarrollo',
      port: Number(process.env.DB_PORT) || 3306,
    },
    acquireConnectionTimeout: 5000,
    pool: {
      min: 0,
      max: 7,
      afterCreate: (conn: any, cb: any) => {
        conn.query('SET NAMES utf8mb4', (err: any) => cb(err, conn));
      }
    },
    migrations: {
      directory: '../database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: '../database/seeds',
    },
  },
  test: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'desarrollo',
      port: Number(process.env.DB_PORT) || 3306,
    },
    migrations: {
      directory: '../database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: '../database/seeds',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: '../database/migrations',
    },
  },
};

export default config;
