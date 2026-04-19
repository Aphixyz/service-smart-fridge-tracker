import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appError } from '../error/AppError.ts';
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(appError.unauthorized('No token provided'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    }
    catch (err) {
        next(appError.unauthorized('Invalid or expired token'));
    }
};
//# sourceMappingURL=auth.middleware.js.map