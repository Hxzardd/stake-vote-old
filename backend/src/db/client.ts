import pg from 'pg';
import { config } from '../config.js';

const pool = new pg.Pool({
  connectionString: config.database.url,
  max: 10,
  idleTimeoutMillis: 30000,
});

export type PoolClient = pg.PoolClient;
export { pool };

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
