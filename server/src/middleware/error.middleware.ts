import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

/**
 * Middleware central de manejo de errores
 * Garantiza que todas las respuestas de error sigan el formato del Blueprint.
 */
export const errorMiddleware = (
  err: any, // Express error middleware REQUIRES 4 arguments, and 'err' is usually 'any' from third parties
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let error = err as any;

  // Si es un error de Zod, lo convertimos a AppError de validación
  if (error.name === 'ZodError') {
    error = new AppError(
      'VALIDATION_FAILED',
      422,
      'Los datos proporcionados no son válidos',
      error.errors
    );
  }

  // Si es un AppError conocido
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      code: error.errorCode,
      message: error.message,
      details: error.details,
    });
  }

  // Error inesperado (Guerra al console.log en prod, pero útil en desarrollo)
  console.error('🔥 Unhandled Error:', err);

  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'Ha ocurrido un error interno en el servidor' 
      : err.message
  });
};
