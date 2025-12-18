import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['ripe_plantain_chips', 'unripe_plantain_chips', 'fruit_juice', 'loaded_plantain']),
  price: z.number().nonnegative(),
  unit: z.enum(['kg', 'piece', 'bottle']).default('piece'),
  weight: z.number().nonnegative().optional(),
  packagingType: z.enum(['bucket', 'refill', 'none']).default('none'),
  images: z.array(z.string()).optional().default([]),
  stock: z.number().int().nonnegative().optional().default(0),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;



