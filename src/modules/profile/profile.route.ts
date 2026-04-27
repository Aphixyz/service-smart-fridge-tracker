import { Router, type Response } from "express";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { authMiddleware } from "../../common/middleware/auth.middleware.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import type { AuthRequest } from "../auth/auth.type.ts";

export const profileRouter = Router();

profileRouter.get(
    "/profiles",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        res.json(apiResponse.ok(req.user));
    }),
);
