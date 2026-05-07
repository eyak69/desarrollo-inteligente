const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

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
    console.error('❌ Error al crear la base de datos:', err.message);
  } finally {
    await connection.end();
  }
}

createDatabase();
