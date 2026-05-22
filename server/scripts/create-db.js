import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'desarrollo'}\`;`);
    console.log(`✅ Base de datos '${process.env.DB_NAME || 'desarrollo'}' creada o ya existente.`);
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Error al crear la base de datos:', err.message);
    } else {
      console.error('❌ Error al crear la base de datos:', err);
    }
  } finally {
    await connection.end();
  }
}

createDatabase();
