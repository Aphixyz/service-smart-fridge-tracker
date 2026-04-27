import { Router, type Request, type Response } from "express";
import { otpController } from "./otp.controller.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { apiResponse } from "../../common/response/ApiResponse.ts";

export const otpRouter = Router();

otpRouter.post(
    "/otp/send",
    catchAsync(async (req: Request, res: Response) => {
        const result = await otpController.send(req);
        res.json(apiResponse.ok(result, "OTP sent to email"));
    }),
);

otpRouter.post(
    "/otp/verify",
    catchAsync(async (req: Request, res: Response) => {
        const result = await otpController.verify(req);
        res.json(apiResponse.ok(result, "OTP verified"));
    }),
);
