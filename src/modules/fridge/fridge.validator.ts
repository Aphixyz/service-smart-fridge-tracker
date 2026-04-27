import { z, type ZodType } from 'zod';
import { appError } from '../../common/error/AppError.ts';

export const FridgeSchema = {
  create: z.object({
    name: z.string().min(1, 'Name is required'),
    expiry_date: z.string().min(1, 'Expiry date is required'),
    quantity: z.number().min(0, 'Quantity must be positive'),
    unit: z.string().min(1, 'Unit is required'),
    category_id: z.number().int().positive('Category ID must be a positive integer'),

  }),
  
  update: z.object({
    quantity: z.number().min(0).optional(),
    category_id: z.number().int().positive('Category ID must be a positive integer').optional(),
    name: z.string().min(1, 'Name is required').optional(),
    expiry_date: z.string().min(1, 'Expiry date is required').optional(),
    unit: z.string().min(1, 'Unit is required').optional(),
  }),
};

export const FridgeIdSchema = z.object({
  fridgeId: z.coerce.number().int().positive('Fridge ID ต้องเป็นตัวเลขบวก'),
  productId: z.coerce.number().int().positive('Product ID ต้องเป็นตัวเลขบวก'),
});


export const validate = <T>(schema: ZodType<T>) => (data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    throw appError.badRequest(message);
  }
  return result.data;
};
