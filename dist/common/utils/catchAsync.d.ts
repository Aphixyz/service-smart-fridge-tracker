/**
 * Wrapper สำหรับจัดการ Async error ใน Express route
 * ช่วยให้ไม่ต้องเขียน try/catch ทุกที่
 */
import { Request, Response, NextFunction } from 'express';
export declare const catchAsync: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=catchAsync.d.ts.map