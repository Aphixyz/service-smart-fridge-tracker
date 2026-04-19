import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appError } from '../error/AppError.ts';
import { getAuthTokenFromRequest } from '../utils/authCookie.ts';
import type { AuthRequest, AuthTokenPayload } from '../../modules/auth/auth.type.ts';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = getAuthTokenFromRequest(req);

  if (!token) {
    return next(appError.unauthorized('No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch {
    next(appError.unauthorized('Invalid or expired token'));
  }
};
