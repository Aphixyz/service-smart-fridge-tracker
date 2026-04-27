import { z } from "zod";

export const RegisterSchema = {
  create: z
    .object({
      username: z
        .string()
        .email("รูปแบบอีเมลไม่ถูกต้อง"),

      name: z
        .string()
        .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
        .max(20, "ชื่อต้องไม่เกิน 20 ตัวอักษร"),

      password: z
        .string()
        .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
        .regex(/[A-Z]/, "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
        .regex(/[a-z]/, "รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว")
        .regex(/[0-9]/, "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว")
        .max(100, "รหัสผ่านต้องไม่เกิน 100 ตัวอักษร"),

      confirmpassword: z.string(),
    })
    .refine((data) => data.password === data.confirmpassword, {
      message: "รหัสผ่านไม่ตรงกัน",
      path: ["confirmpassword"], // 👈 สำคัญ: ชี้ error ไป field นี้
    }),
};