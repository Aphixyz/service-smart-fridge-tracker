import { z } from 'zod';
import { appError } from '../../common/error/AppError.ts';
/**
 * User Validation Schemas
 */
export const UserSchema = {
    create: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['admin', 'user']).optional(),
    }),
    update: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
    }),
};
/**
 * Validate Helper
 */
export const validate = (schema) => (data) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        const message = result.error.errors.map(err => `${err.path}: ${err.message}`).join(', ');
        throw appError.badRequest(message);
    }
    return result.data;
};
//# sourceMappingURL=user.validator.js.map