import { z } from 'zod';

export const createReviewSchema = z.object({
    type: z.enum(['store', 'product']),
    productId: z.string().optional(),
    customerName: z.string().min(2).max(100),
    customerEmail: z.string().email(),
    customerLocation: z.string().max(100).optional(),
    rating: z.number().min(1).max(5),
    title: z.string().max(200).optional(),
    comment: z.string().min(10).max(1000),
    images: z.array(z.string()).optional(),
    isVerifiedPurchase: z.boolean().optional(),
});

export const updateReviewStatusSchema = z.object({
    status: z.enum(['pending', 'approved', 'rejected']),
});
