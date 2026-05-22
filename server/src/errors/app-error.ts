/**
 * AppError - Clase base para errores operativos del sistema
 * Sigue el estándar definido en .blueprint/docs/conventions/api-error-format.md
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details: unknown;
  public readonly isOperational: boolean;

  constructor(
    errorCode: string,
    statusCode: number = 500,
    message: string,
    details: unknown = null,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
