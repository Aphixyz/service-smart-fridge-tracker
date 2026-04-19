/**
 * Wrapper สำหรับจัดการ Async error ใน Express route
 * ช่วยให้ไม่ต้องเขียน try/catch ทุกที่
 */
import { Request, Response, NextFunction } from 'express';
export const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
//# sourceMappingURL=catchAsync.js.map