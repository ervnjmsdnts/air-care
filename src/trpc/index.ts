import { z } from 'zod';
import { privateProcedure, publicProcedure, router } from './trpc';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { updateUserSchema, userIdSchema } from './schema';

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
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        address: z.string(),
        phoneNumber: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const exist = await db.user.findFirst({ where: { email: input.email } });

      if (exist?.id)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Account already exists',
        });

      const user = await db.user.create({ data: { ...input } });

      return user;
    }),

  // User
  getCurrentUser: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

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
    .input(updateUserSchema.merge(userIdSchema))
    .mutation(async ({ input }) => {
      await db.user.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  deleteUser: publicProcedure
    .input(userIdSchema)
    .mutation(async ({ input }) => {
      await db.user.delete({ where: { id: input.id } });
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
    const audits = await db.audit.findMany({ include: { user: true } });

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
});

export type AppRouter = typeof appRouter;
