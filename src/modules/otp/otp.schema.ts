import { z } from "zod";

export const otpSchema = {
  send: z.object({
    email: z.string().email(),
    purpose: z.string().default("login"),
  }),

  verify: z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    purpose: z.string().default("login"),
  }),
};