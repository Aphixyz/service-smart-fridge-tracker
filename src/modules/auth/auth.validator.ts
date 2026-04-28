import { z } from "zod";

export const LoginSchema = {


  login: z
    .object({
      username: z.string().email(),
      password: z
        .string()
        .min(1, "กรุณากรอกรหัสผ่าน"),
    }),


  resetPassword: z.object({
    username: z.string().email(),
    newPassword: z
      .string()
      .min(1, "กรุณากรอกรหัสผ่าน"),
    confirmPassword: z
      .string()
      .min(1, "กรุณากรอกรหัสผ่าน"),
  })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "รหัสผ่านไม่ตรงกัน",
      path: ["confirmPassword"],
    }),

};
