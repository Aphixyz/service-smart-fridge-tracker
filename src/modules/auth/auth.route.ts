import { Router, type Request, type Response } from "express";
import { authService } from "./auth.service.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import {
  clearAuthCookie,
  setAuthCookie,
} from "../../common/utils/authCookie.ts";
import { LoginSchema } from "../../modules/auth/auth.validator.ts";

export const authRouter = Router();

authRouter.post(
  "/auth/login",
  catchAsync(async (req: Request, res: Response) => {

    const result = LoginSchema.login.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json(apiResponse.error(result.error.issues[0].message));
    }
    const { token, user } = await authService.login(result.data);
    setAuthCookie(res, token);
    res.json(apiResponse.ok({ user }, "Login successful"));

  }),
);

authRouter.post(
  "/auth/logout",
  catchAsync(async (_req: Request, res: Response) => {
    clearAuthCookie(res);
    res.json(apiResponse.ok(null, "Logout successful"));
  }),
);


authRouter.put("/auth/reset-password", catchAsync(async (_req: Request, res: Response) => {

  const result = LoginSchema.resetPassword.safeParse(_req.body);

  if (!result.success) {
    return res.status(400).json({
      message: result.error.issues[0].message,
    });
  }

  const response = await authService.resetPassword(result.data);

  res.json(apiResponse.ok(response, "Reset password successful"));

}))