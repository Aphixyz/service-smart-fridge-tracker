import { z } from 'zod';
/**
 * User Validation Schemas
 */
export declare const UserSchema: {
    create: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<{
            user: "user";
            admin: "admin";
        }>>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
/**
 * Validate Helper
 */
export declare const validate: (schema: any) => (data: any) => any;
//# sourceMappingURL=user.validator.d.ts.map