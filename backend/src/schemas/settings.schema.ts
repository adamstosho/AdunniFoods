import { z } from 'zod';

export const updateAdminCredentialsSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newUsername: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ['confirmNewPassword'],
});

export type UpdateAdminCredentialsInput = z.infer<typeof updateAdminCredentialsSchema>;

