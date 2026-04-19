import type { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../response/ApiResponse.ts';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(apiResponse.error(`Route ${req.originalUrl} not found`));
};


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
  }

  res.status(statusCode).json(apiResponse.error(message));
};
