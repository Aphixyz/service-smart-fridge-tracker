import { z } from "zod";

export const LoginSchema = {
  login: z
    .object({
      username: z.string().email(),
      password: z
        .string()
        .min(1, "กรุณากรอกรหัสผ่าน"),
    })
};
