import { z } from "zod";
import { appError } from "../../common/error/AppError.ts";

export const ProductSchema = {
    create: z.object({
        name: z.string().min(1, "Name is required"),
    }),

    update: z.object({
        name: z.string().min(1, "Name is required").optional(),
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
