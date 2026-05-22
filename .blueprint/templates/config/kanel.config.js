/**
 * Configuración Modelo de Kanel (Generación de Tipos TypeScript)
 * 
 * Este archivo sirve como estándar de gobernanza en el Blueprint para instruir
 * cómo generar automáticamente interfaces y tipos de TypeScript a partir de la 
 * estructura física de la base de datos, evitando la duplicación manual de definiciones.
 * 
 * Se recomienda usarlo junto a `@kanel/knex` para abstraer el motor de base de datos
 * (MySQL, MariaDB o PostgreSQL) a través de la configuración existente de Knex.
 * 
 * Requisitos de instalación en el backend:
 * - npm install -D kanel @kanel/knex
 * 
 * Ejecución típica:
 * - npx kanel
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  // Configuración de la conexión compartida por Knex
  connection: {
    client: process.env.DB_CLIENT || 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // Manejo estricto de la zona horaria en la conexión
      timezone: 'Z', 
    },
  },

  // Ruta de destino para almacenar las definiciones de TypeScript autogeneradas
  outputPath: path.resolve(process.cwd(), 'server/src/types/schema'),

  // Plugins para enriquecer la generación de tipos
  plugins: [
    // Plugin oficial para procesar esquemas usando la introspección de Knex
    require('@kanel/knex').default,
  ],

  // Reglas de nomenclatura y formateo de nombres
  preDeleteOutputFolder: true, // Limpiar la carpeta de salida antes de regenerar
  
  // Opciones de generación personalizadas
  typeFilter: (pgType) => true, // Filtro por si se requiere omitir tablas del sistema o de migraciones
  
  customGenerators: [
    // Aquí se pueden registrar generadores de validación como Zod schemas automáticos si se requiere
  ]
};
