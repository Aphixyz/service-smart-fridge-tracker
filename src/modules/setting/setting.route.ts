import { Router, type Response } from "express";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { authMiddleware } from "../../common/middleware/auth.middleware.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { settingService } from "./setting.service.ts";
import type { AuthRequest } from "../auth/auth.type.ts";

export const settingRouter = Router();

settingRouter.get(
  "/settings",
  authMiddleware,
  catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const setting = await settingService.findSettingByUserId(Number(userId));
    res.json(apiResponse.ok(setting));
  }),
);

settingRouter.post(
  "/settings",
  authMiddleware,
  catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const data = req.body;
    const setting = await settingService.buildSetting(Number(userId), data);
    res.json(apiResponse.ok(setting));
  }),
);
