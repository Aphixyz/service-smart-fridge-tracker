import { z } from "zod";

export const LoginSchema = {
  login: z
    .object({
      username: z.string().email(),
    })
};
