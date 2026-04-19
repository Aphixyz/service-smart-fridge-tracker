import { z } from "zod";
import { appError } from "../../common/error/AppError.ts";


export const RegisterSchema = {
    create: z.object({
        username: z
            .string()
            .min(4, 'Username must be at least 4 characters')
            .max(20, 'Username must be at most 20 characters'),
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(20, 'Name must be at most 20 characters'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .max(100, 'Password must be at most 100 characters'),
        confirmpassword: z
            .string()
    }).refine((data) => data.password === data.confirmpassword, {
        message: 'Passwords do not match',            
    }),
}

    export const validate = (schema: z.ZodSchema) => (data: any) => {
    const result = schema.safeParse(data);
    
    if (!result.success) {
        // ใช้ result.error.issues หรือ result.error.flatten() จะปลอดภัยกว่า
        const message = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");
            
        throw appError.badRequest(message);
    }
    
    return result.data;
        return result.data
    }