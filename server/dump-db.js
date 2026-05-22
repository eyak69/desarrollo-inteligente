import knex from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../.env' });

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ojoseco6971',
    database: process.env.DB_NAME || 'desarrollo',
    port: Number(process.env.DB_PORT) || 3306,
  }
});

async function dump() {
  const rows = await db('ideas').select('*');
  console.log(JSON.stringify(rows, null, 2));
  await db.destroy();
}

dump().catch(console.error);
