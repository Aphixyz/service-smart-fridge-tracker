import { Router, type Request, type Response } from "express";
import { authService } from "./auth.service.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import {
  clearAuthCookie,
  setAuthCookie,
} from "../../common/utils/authCookie.ts";
import { LoginSchema } from "../../modules/auth/auth.validator.ts";
import { appError } from "../../common/error/AppError.ts";

export const authRouter = Router();

authRouter.post(
  "/auth/login",
  catchAsync(async (req: Request, res: Response) => {
    try {
      const result = LoginSchema.login.safeParse(req.body);
      if (!result.success) {
        res.json(apiResponse.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'))
      }
      const { token, user } = await authService.login(req.body);
      setAuthCookie(res, token);
      res.json(apiResponse.ok({ user }, "เข้าสู่ระบบสำเร็จ"));
    } catch (error) {
      console.log(error);
    }
  }),
);

authRouter.post(
  "/auth/logout",
  catchAsync(async (_req: Request, res: Response) => {
    clearAuthCookie(res);
    res.json(apiResponse.ok(null, "ออกจากระบบสำเร็จ"));
  }),
);
