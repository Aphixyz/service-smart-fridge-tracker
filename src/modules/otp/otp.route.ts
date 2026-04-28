import { Router, type Request, type Response } from "express";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { otpSchema } from "./otp.schema.ts";
import { otpService } from "./otp.service.ts";

export const otpRouter = Router();

otpRouter.post(
    "/otp/send",
    catchAsync(async (req: Request, res: Response) => {
        const result = otpSchema.send.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json(apiResponse.error(result.error.issues[0].message));
        }
        const data = await otpService.sendOtp(result.data.email, result.data.purpose);
        res.json(apiResponse.ok(data, "OTP sent to email"));
    }),
);

otpRouter.post(
    "/otp/verify",
    catchAsync(async (req: Request, res: Response) => {
        const result = otpSchema.verify.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json(apiResponse.error(result.error.issues[0].message));
        }
        await otpService.verifyOtp(result.data.email, result.data.otp, result.data.purpose);
        res.json(apiResponse.ok({ email: result.data.email, purpose: result.data.purpose }, "OTP verified"));
    }),
);
