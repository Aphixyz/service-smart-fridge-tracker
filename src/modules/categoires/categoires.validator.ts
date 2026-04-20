import { z } from "zod";
import { appError } from "../../common/error/AppError.ts";

export const CategoiresSchema = {
  params: z.object({
    id: z.coerce.number().int().positive("Id must be a positive number"),
  }),

  create: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(50, "Maximum 50 characters"),
    icon: z
      .string()
      .trim()
      .min(1, "Icon is required")
      .optional(),
  }),

  update: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(50, "Maximum 50 characters")
      .optional(),
    icon: z
      .string()
      .trim()
      .min(1, "Icon is required")
      .optional(),
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
