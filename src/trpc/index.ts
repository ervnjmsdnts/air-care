import { z } from 'zod';
import { privateProcedure, publicProcedure, router } from './trpc';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import {
  changePasswordSchema,
  createProductSchema,
  createUserSchema,
  idSchema,
  manualEntrySchema,
  statusSchema,
  updateProductSchema,
  updateUserSchema,
} from './schema';
import { AppointmentStatus } from '@prisma/client';

export const appRouter = router({
  // Auth
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await db.user.findFirst({ where: { email: input.email } });

      if (!user?.id || user?.password !== input.password) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid Credentials',
        });
      }

      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      const MAX_AGE = 60 * 60 * 24 * 30; // 30 Days

      const token = await new jose.SignJWT({ ...user })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);

      const sessionOption = {
        name: 'session',
        value: token,
        maxAge: MAX_AGE,
        httpOnly: true,
        secure: true,
      };

      cookies().set(sessionOption);

      return user;
    }),
  signUp: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      const exist = await db.user.findFirst({ where: { email: input.email } });

      if (exist?.id)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Account already exists',
        });

      const user = await db.user.create({
        data: {
          address: input.address,
          name: input.name,
          phoneNumber: input.phoneNumber,
          email: input.email,
          password: input.password,
        },
      });

      return user;
    }),

  // User
  getCurrentUser: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const user = await db.user.findFirst({ where: { id: userId } });

    return user;
  }),
  getUsers: publicProcedure.query(async () => {
    const users = await db.user.findMany();

    return users;
  }),
  updateCurrentUser: privateProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      await db.user.update({ where: { id: userId }, data: { ...input } });
    }),
  updateUser: publicProcedure
    .input(updateUserSchema.merge(idSchema))
    .mutation(async ({ input }) => {
      await db.user.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  deleteUser: publicProcedure.input(idSchema).mutation(async ({ input }) => {
    await db.user.delete({ where: { id: input.id } });
  }),
  changePassword: privateProcedure
    .input(changePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await db.user.findFirst({ where: { id: ctx.userId } });

      if (input.oldPassword !== user?.password) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await db.user.update({
        where: { id: ctx.userId },
        data: { password: input.newPassword },
      });
    }),

  // Audits
  getLatestAudits: publicProcedure.query(async () => {
    const audits = await db.audit.findMany({
      take: 7,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return audits;
  }),
  getAudits: publicProcedure.query(async () => {
    const audits = await db.audit.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return audits;
  }),
  createAudit: publicProcedure
    .input(
      z.object({
        label: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.audit.create({
        data: { label: input.label, userId: input.userId },
      });
    }),

  // Inventory
  createProduct: privateProcedure
    .input(createProductSchema)
    .mutation(async ({ input, ctx }) => {
      await db.inventory.create({ data: { ...input } });
      await db.audit.create({
        data: {
          label: `User ${ctx.user.name} added a product`,
          userId: ctx.userId,
        },
      });

      return { success: true };
    }),
  getProducts: publicProcedure.query(async () => {
    const products = await db.inventory.findMany();

    return products;
  }),
  getValidProducts: publicProcedure.query(async () => {
    const validProducts = await db.inventory.findMany({
      where: { quantity: { not: 0 } },
    });

    return validProducts;
  }),
  getProductPoll: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const product = await db.inventory.findFirst({
        where: {
          key: input.key,
        },
      });

      if (!product) throw new TRPCError({ code: 'NOT_FOUND' });

      return product;
    }),
  addProductImage: publicProcedure
    .input(
      z.object({ url: z.string(), key: z.string(), productId: z.string() }),
    )
    .mutation(async ({ input }) => {
      await db.inventory.update({
        where: { id: input.productId },
        data: { url: input.url, key: input.key },
      });
    }),
  deleteProduct: publicProcedure.input(idSchema).mutation(async ({ input }) => {
    await db.inventory.delete({ where: { id: input.id } });
  }),
  updateProduct: publicProcedure
    .input(updateProductSchema.merge(idSchema))
    .mutation(async ({ input }) => {
      await db.inventory.update({
        where: { id: input.id },
        data: { ...input, id: undefined },
      });
    }),

  // Appointment
  createAppointment: privateProcedure
    .input(
      z.object({
        productId: z.string(),
        price: z.number(),
        type: z.enum(['INSTALLATION', 'REPAIR', 'PURCHASE', 'CLEANING']),
        quantity: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const appointment = await db.appointment.create({
        data: { ...input, userId: ctx.userId },
      });

      if (!appointment) return new TRPCError({ code: 'BAD_REQUEST' });

      await db.audit.create({
        data: {
          label: `User ${ctx.user.name} created an appointment`,
          userId: ctx.userId,
        },
      });

      return { success: true };
    }),

  getLatestAppointments: publicProcedure.query(async () => {
    const latestAppointments = await db.appointment.findMany({
      take: 7,
      include: { user: true, product: true },
      orderBy: { createdAt: 'desc' },
      where: { NOT: { status: 'DONE' } },
    });

    return latestAppointments;
  }),
  getAppointments: publicProcedure.query(async () => {
    const appointments = await db.appointment.findMany({
      include: { user: true, product: true },
      where: { NOT: { status: 'DONE' } },
      orderBy: { updatedAt: 'desc' },
    });

    return appointments;
  }),
  getUserAppointments: privateProcedure.query(async ({ ctx }) => {
    const appointments = await db.appointment.findMany({
      where: { userId: ctx.userId },
      include: { product: true },
    });

    return appointments;
  }),
  getUserAppointment: publicProcedure
    .input(idSchema)
    .query(async ({ input }) => {
      const appointment = await db.appointment.findFirst({
        where: { id: input.id },
        include: { product: true, user: true },
      });

      return appointment;
    }),

  updateAppointmentStatus: privateProcedure
    .input(statusSchema.merge(idSchema))
    .mutation(async ({ input, ctx }) => {
      const appointment = await db.appointment.update({
        where: { id: input.id },
        data: { status: input.status },
        include: { product: true },
      });

      if (!appointment) return new TRPCError({ code: 'NOT_FOUND' });

      const statusMessages: Partial<Record<AppointmentStatus, string>> = {
        APPROVED:
          'Great news! Your appointment has been approved. Please choose a suitable date and time.',
        DENIED:
          "We're sorry, but your appointment has been denied. Please contact us for further assistance.",
        ONGOING:
          "Your appointment is currently in progress. We hope it's going smoothly!",
        DONE: 'Congratulations! Your appointment is now complete. We hope it was a success!',
      };

      const message = statusMessages[appointment.status] || '';

      await db.audit.create({
        data: {
          label: `User ${ctx.user.name} changed status of ${appointment.product.name} to ${input.status}`,
          userId: ctx.userId,
        },
      });

      if (
        appointment.quantity &&
        appointment.type === 'PURCHASE' &&
        appointment.status === 'DONE'
      ) {
        const currentProduct = await db.inventory.findUnique({
          where: { id: appointment.productId },
        });

        if (!currentProduct) return new TRPCError({ code: 'NOT_FOUND' });

        await db.inventory.update({
          where: { id: appointment.productId },
          data: { quantity: currentProduct.quantity - appointment.quantity },
        });

        await db.audit.create({
          data: {
            label: `Deducted ${appointment.quantity} from ${appointment.product.name} product`,
            userId: ctx.userId,
          },
        });
      }

      await db.notification.create({
        data: {
          userId: appointment.userId!,
          message,
          appointmentId: appointment.id,
        },
      });

      return { success: true };
    }),
  setScheduleDate: privateProcedure
    .input(
      idSchema.merge(
        z.object({
          scheduleDate: z.string().optional(),
          hours: z.enum(['MORNING', 'AFTERNOON']),
        }),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      await db.appointment.update({
        where: { id: input.id },
        data: {
          scheduledDate: new Date(input.scheduleDate!),
          hours: input.hours,
        },
      });

      await db.audit.create({
        data: {
          label: `User ${ctx.user.name} added a scheduled date on their appointment`,
          userId: ctx.userId,
        },
      });

      return { success: true };
    }),

  getDoneAppointments: publicProcedure.query(async () => {
    const doneAppointments = await db.appointment.findMany({
      where: { status: 'DONE' },
      orderBy: { updatedAt: 'desc' },
      include: { user: true, product: true },
    });

    return doneAppointments;
  }),
  createManualService: publicProcedure
    .input(manualEntrySchema)
    .mutation(async ({ input }) => {
      const appointment = await db.appointment.create({
        data: {
          scheduledDate: new Date(),
          productId: input.productId,
          userId: null,
          type: input.type,
          quantity: input.quantity || null,
          status: 'DONE',
          price: input.price,
        },
      });
      if (
        appointment.quantity &&
        appointment.type === 'PURCHASE' &&
        appointment.status === 'DONE'
      ) {
        const currentProduct = await db.inventory.findUnique({
          where: { id: appointment.productId },
        });

        if (!currentProduct) return new TRPCError({ code: 'NOT_FOUND' });

        await db.inventory.update({
          where: { id: appointment.productId },
          data: { quantity: currentProduct.quantity - appointment.quantity },
        });
      }
    }),

  // Notifications
  getNotifications: privateProcedure.query(async ({ ctx }) => {
    const notifications = await db.notification.findMany({
      where: { userId: ctx.userId, type: 'NEW' },
      orderBy: { createdAt: 'desc' },
    });

    return notifications;
  }),
  archiveNotification: privateProcedure
    .input(
      z.object({
        notificationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.notification.updateMany({
        where: { userId: ctx.userId, id: input.notificationId },
        data: { type: 'ARCHIVED' },
      });
    }),
});

export type AppRouter = typeof appRouter;
