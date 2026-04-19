import { z } from 'zod';
import { appError } from '../../common/error/AppError.ts';

export const FridgeSchema = {
  create: z.object({
    quantity: z.number().min(0, 'Quantity must be positive'),
    category: z.string().min(1, 'Category is required'),
  }),
  
  update: z.object({
    quantity: z.number().min(0).optional(),
    category: z.string().optional(),
  }),
};

export const validate = (schema) => (data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.errors.map(err => `${err.path}: ${err.message}`).join(', ');
    throw appError.badRequest(message);
  }
  return result.data;
};
