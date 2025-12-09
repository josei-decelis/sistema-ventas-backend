import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Error de Prisma - Registro duplicado
  if (err.message.includes('Unique constraint failed')) {
    return res.status(400).json({
      status: 'fail',
      message: 'Ya existe un registro con esos datos',
    });
  }

  // Error de Prisma - Registro no encontrado
  if (err.message.includes('Record to update not found')) {
    return res.status(404).json({
      status: 'fail',
      message: 'Registro no encontrado',
    });
  }

  console.error('ERROR 💥', err);

  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Algo salió mal en el servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
