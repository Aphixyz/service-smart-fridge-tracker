import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../response/ApiResponse.ts';
export const notFoundHandler = (req, res) => {
    res.status(404).json(apiResponse.error(`Route ${req.originalUrl} not found`));
};
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Internal Server Error';
    if (process.env.NODE_ENV === 'development') {
        console.error('Error Stack:', err.stack);
    }
    res.status(statusCode).json(apiResponse.error(message));
};
//# sourceMappingURL=errorHandler.js.map