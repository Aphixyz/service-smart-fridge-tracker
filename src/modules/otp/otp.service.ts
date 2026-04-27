import bcrypt from "bcrypt";
import { otpRepository } from "./otp.repository";
import { sentOtpEmail } from "../../common/mail/mail";

export const otpService = {


    async sendOtp(email: string, purpose: string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpHash = await bcrypt.hash(otp, 6);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await otpRepository.create({
            email,
            otp_hash: otpHash,
            purpose,
            expires_at: expiresAt,
        });

        await sentOtpEmail(email, otp);

        return {
            email,
            purpose,
        };
    },


    async verifyOtp(email: string, otp: string, purpose: string) {
        const record = await otpRepository.findLatest(email, purpose);

        if (!record) {
            throw new Error("OTP not found");
        }

        if (record.verified_at) {
            throw new Error("OTP already used");
        }

        if (new Date(record.expires_at) < new Date()) {
            throw new Error("OTP expired");
        }

        if (record.attempts >= 5) {
            throw new Error("Too many attempts");
        }

        const isMatch = await bcrypt.compare(otp, record.otp_hash);

        if (!isMatch) {
            await otpRepository.increaseAttempts(record.id);
            throw new Error("Invalid OTP");
        }

        await otpRepository.markVerified(record.id);

        return true;
    },

}
