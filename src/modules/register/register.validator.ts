import { z } from "zod";
import { appError } from "../../common/error/AppError.ts";

export const RegisterSchema = {
  create: z
    .object({
      username: z.string().email(),
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(20, "Name must be at most 20 characters"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .max(100, "Password must be at most 100 characters"),
      confirmpassword: z.string(),
    })
    .refine((data) => data.password === data.confirmpassword, {
      message: "Passwords do not match",
    }),
};
