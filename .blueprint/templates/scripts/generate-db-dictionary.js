/**
 * Script de Autogeneración del Diccionario de Datos (MySQL/MariaDB)
 * 
 * Este script se conecta a la base de datos configurada en el archivo `.env`,
 * extrae el esquema lógico directo del motor (tablas, columnas, tipos, PKs, FKs, comentarios)
 * y autogenera el archivo de documentación de gobernanza del Blueprint.
 * 
 * Requisitos:
 * - npm install mysql2 dotenv
 * 
 * Uso:
 * - node generate-db-dictionary.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno. Intenta buscar en el directorio actual de ejecución (raíz del proyecto)
// y como fallback en la ruta relativa fija del blueprint.
const envPath = process.env.ENV_PATH || path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// El destino se resuelve relativo al proceso actual para facilitar su ejecución desde la raíz,
// o mediante una variable de entorno dedicada para CI/CD.
const DESTINO_MARKDOWN = process.env.DB_DICTIONARY_OUTPUT || path.resolve(process.cwd(), 'docs/database/database-dictionary.md');

// Tablas a ignorar (tablas internas de control)
const TABLAS_IGNORADAS = ['knex_migrations', 'knex_migrations_lock'];

async function generate() {
  if (!DB_NAME) {
    console.error('❌ Error: La variable de entorno DB_NAME no está definida.');
    process.exit(1);
  }

  console.log(`📡 Conectando a la base de datos '${DB_NAME}' en '${DB_HOST}'...`);

  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'information_schema', // Nos conectamos al esquema de información
  });

  try {
    // 1. Obtener la información de todas las tablas
    const [tablas] = await connection.query(
      `SELECT TABLE_NAME, TABLE_COMMENT 
       FROM TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
      [DB_NAME]
    );

    if (tablas.length === 0) {
      console.warn('⚠️ No se encontraron tablas en la base de datos especificada.');
    }

    let markdown = `# Diccionario de Datos (Autogenerado)\n\n`;
    markdown += `*Última autogeneración: ${new Date().toISOString().split('T')[0]}*\n\n`;
    markdown += `Este documento ha sido autogenerado a partir del esquema lógico físico de la base de datos en cumplimiento con la **Regla de Automatización A** del Blueprint. **No editar este archivo manualmente.**\n\n`;
    markdown += `---\n\n`;

    // 2. Por cada tabla, obtener la metadata de sus columnas
    for (const tabla of tablas) {
      const nombreTabla = tabla.TABLE_NAME;

      if (TABLAS_IGNORADAS.includes(nombreTabla)) {
        continue;
      }

      console.log(`🔍 Procesando tabla: ${nombreTabla}...`);

      const comentarioTabla = tabla.TABLE_COMMENT || 'Sin descripción detallada en la base de datos.';

      markdown += `## Tabla: \`${nombreTabla}\`\n\n`;
      markdown += `> **Descripción:** ${comentarioTabla}\n\n`;
      markdown += `| Columna | Tipo | Nulo | Clave | Defecto | Descripción / Comentario |\n`;
      markdown += `| :--- | :--- | :---: | :---: | :---: | :--- |\n`;

      const [columnas] = await connection.query(
        `SELECT 
          COLUMN_NAME, 
          COLUMN_TYPE, 
          IS_NULLABLE, 
          COLUMN_KEY, 
          COLUMN_DEFAULT, 
          COLUMN_COMMENT 
         FROM COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? 
         ORDER BY ORDINAL_POSITION`,
        [DB_NAME, nombreTabla]
      );

      for (const col of columnas) {
        const nombre = col.COLUMN_NAME;
        const tipo = col.COLUMN_TYPE.toUpperCase();
        const nulo = col.IS_NULLABLE === 'YES' ? 'Sí' : 'No';
        
        let clave = '';
        if (col.COLUMN_KEY === 'PRI') clave = '🔑 PK';
        else if (col.COLUMN_KEY === 'UNI') clave = '💎 UNIQUE';
        else if (col.COLUMN_KEY === 'MUL') clave = '🔗 FK / Index';

        const defecto = col.COLUMN_DEFAULT !== null ? `\`${col.COLUMN_DEFAULT}\`` : '*Ninguno*';
        const comentario = col.COLUMN_COMMENT || '*Sin comentario*';

        markdown += `| \`${nombre}\` | \`${tipo}\` | ${nulo} | ${clave} | ${defecto} | ${comentario} |\n`;
      }

      markdown += `\n---\n\n`;
    }

    // Asegurar que la carpeta de destino existe
    const dirDestino = path.dirname(DESTINO_MARKDOWN);
    if (!fs.existsSync(dirDestino)) {
      fs.mkdirSync(dirDestino, { recursive: true });
    }

    // Escribir el Markdown
    fs.writeFileSync(DESTINO_MARKDOWN, markdown, 'utf8');
    console.log(`\n🎉 Diccionario de datos autogenerado con éxito en: \n👉 ${DESTINO_MARKDOWN}`);

  } catch (err) {
    console.error('❌ Error durante la generación del diccionario de datos:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

generate();
