import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const userIdSchema = z.object({
  id: z.string(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UserIdSchema = z.infer<typeof userIdSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
