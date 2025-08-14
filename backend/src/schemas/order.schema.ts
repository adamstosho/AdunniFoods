import { z } from 'zod';

const orderItemSchema = z.object({
  product: z.string().min(1),
  name: z.string().min(1),
  qty: z.number().int().positive(),
  price: z.number().nonnegative(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(6),
  address: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
  totalAmount: z.number().nonnegative(),
  paymentMethod: z.enum(['bank_transfer', 'mobile_money', 'cash_on_delivery']),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Packed', 'Out for Delivery', 'Completed']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;



