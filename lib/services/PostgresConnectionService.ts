import pg from 'pg';
import { logger } from '../logger/Logger.ts';

class PostgresConnectionService {
  postgresPool: {
    host: string;
    port: number | undefined;
    user: string;
    password: string;
    database: string;
  };

  constructor() {
    this.postgresPool = new pg.Pool({
      host: process.env.POSTGRES_CONNECTION_STRING,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE
    });
  }

  async runQuery(SQL: string, values?: (string | number)[]) {
    try {
      const result = (await this.postgresPool.query(SQL, values)).rows;
      return result;
    } catch (err) {
      logger.logPostgresError(err);
      throw err;
    }
  }
}

export const postgresConnectionService = new PostgresConnectionService();
