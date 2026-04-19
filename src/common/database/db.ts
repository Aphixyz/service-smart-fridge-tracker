import pg from 'pg';

const { Pool } = pg;

const db = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const checkDbConnection = async (): Promise<void> => {
  try {
    const client = await db.connect();
    console.log('PostgreSQL connected successfully!');
    client.release();
  } catch (err: any) {
    console.error('Database connection error:', err.message || err);
  }
};

export default db;
