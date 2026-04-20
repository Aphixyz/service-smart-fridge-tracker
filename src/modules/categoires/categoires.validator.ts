import { object, z } from "zod";
import { appError } from "../../common/error/AppError.ts";

export const CategoiresSchema = {
  create: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Maximum 50 characters")
      .trim(),
    home_id: z.number().nullable().optional(),
    icon: z.string(),
  }),

  update: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Maximum 50 characters")
      .trim()
      .optional(),
    home_id: z.number().nullable().optional(),
    icon: z.string().optional()
  }),

  params: z.object({
    id: z.string().regex(/^\d+$/, "It must be a number only. "),
  }),
};

export const validate =
  <T>(schema: z.ZodType<T>) =>
  (data: unknown): T => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");

      throw appError.badRequest(message);
    }

    return result.data;
  };
