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
  installPrice: z.number().optional(),
  repairPrice: z.number().optional(),
  buyPrice: z.number().optional(),
  cleanPrice: z.number().optional(),
  quantity: z.number().optional(),
});

export const idSchema = z.object({
  id: z.string(),
});

export const createUserSchema = z
  .object({
    email: z.string().email().min(1, { message: 'Field is required' }),
    password: z.string().min(6, { message: 'Minimum of 6 characters' }),
    address: z.string().min(1, { message: 'Field is required' }),
    phoneNumber: z.string().min(1, { message: 'Field is required' }),
    name: z.string().min(1, { message: 'Field is required' }),
    confirmPassword: z.string().min(1, { message: 'Field is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createProductSchema = z.object({
  name: z.string(),
  brand: z.string(),
  type: z.string(),
  installPrice: z.number(),
  repairPrice: z.number(),
  buyPrice: z.number(),
  cleanPrice: z.number(),
  quantity: z.number(),
});

export const statusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'DENIED', 'ONGOING', 'DONE']),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Field is required'),
    newPassword: z.string().min(6, { message: 'Minimum of 6 characters' }),
    confirmPassword: z.string().min(1, 'Field is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const manualEntrySchema = z.object({
  productId: z.string(),
  type: z.enum(['CLEANING', 'PURCHASE', 'INSTALLATION', 'REPAIR']),
  quantity: z.any().optional(),
  price: z.number(),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type IdSchema = z.infer<typeof idSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type StatusSchema = z.infer<typeof statusSchema>;
export type ManualEntrySchema = z.infer<typeof manualEntrySchema>;
