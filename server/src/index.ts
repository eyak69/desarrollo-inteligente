import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
import { z } from 'zod';

// Cargar variables de entorno
dotenv.config({ path: '../.env' });

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// Validación de variables de entorno (Regla 11)
const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  logger.error('❌ Error de configuración de entorno:', envResult.error.format());
  process.exit(1);
}

const env = envResult.data;

const app = express();

// Seguridad (Regla 10)
app.use(helmet());
app.use(cors());
app.use(express.json());

// Importar rutas

// Logger de requests
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Request recibida');
  next();
});

import { errorMiddleware } from './middleware/error.middleware';

// Registro de API

// Rutas de salud (Regla 11)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Blueprint Maestro API v1.0.0' });
});

// Middleware de error global (DEBE ir al final)
app.use(errorMiddleware);

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${env.PORT}`);
});

// Graceful Shutdown (Regla 11)
const shutdown = () => {
  logger.info('🛑 Cerrando servidor...');
  server.close(() => {
    logger.info('👋 Servidor cerrado.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
