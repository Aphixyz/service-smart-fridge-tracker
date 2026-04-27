import { Router, type Response } from "express";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { authMiddleware } from "../../common/middleware/auth.middleware.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { appError } from "../../common/error/AppError.ts";
import type { AuthRequest } from "../auth/auth.type.ts";
import { profileService } from "./profile.service.ts";

export const profileRouter = Router();

profileRouter.get(
    "/profiles",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.id;

        if (!userId) {
            throw appError.unauthorized("Unauthorized");
        }

        const profile = await profileService.findProfileByUserId(userId);
        res.json(apiResponse.ok(profile));
    }),
);
