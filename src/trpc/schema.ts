import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
  type: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
});

export const idSchema = z.object({
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

export const createProductSchema = z.object({
  name: z.string(),
  brand: z.string(),
  type: z.string(),
  price: z.number(),
  quantity: z.number(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type IdSchema = z.infer<typeof idSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
