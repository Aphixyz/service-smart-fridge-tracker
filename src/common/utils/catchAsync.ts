/**
 * Wrapper สำหรับจัดการ Async error ใน Express route
 * ช่วยให้ไม่ต้องเขียน try/catch ทุกที่
 */
import type { Request, Response, NextFunction } from 'express';

export const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
