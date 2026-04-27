import type { Request } from "express";
import { otpSchema } from "./otp.schema";
import { otpService } from "./otp.service";

export const otpController = {
    async send(req: Request) {
        const body = otpSchema.send.parse(req.body);
        return otpService.sendOtp(body.email, body.purpose);
    },
    
    async verify(req: Request) {
        const body = otpSchema.verify.parse(req.body);

        await otpService.verifyOtp(body.email, body.otp, body.purpose);
        return { email: body.email, purpose: body.purpose };
    },
};
