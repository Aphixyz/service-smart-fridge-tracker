/**
 * Custom application error factory
 */
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const appError = {
  badRequest: (message: string = 'Bad Request'): AppError => createError(message, 400),
  unauthorized: (message: string = 'Unauthorized'): AppError => createError(message, 401),
  forbidden: (message: string = 'Forbidden'): AppError => createError(message, 403),
  notFound: (message: string = 'Not Found'): AppError => createError(message, 404),
  conflict: (message: string = 'Conflict'): AppError => createError(message, 409),
  internal: (message: string = 'Internal Server Error'): AppError => createError(message, 500)
};
