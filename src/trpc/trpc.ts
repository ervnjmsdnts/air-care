import { User } from '@prisma/client';
import { TRPCError, initTRPC } from '@trpc/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const t = initTRPC.context().create();

const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const session = cookies().get('session');

  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const user = await jwtVerify(session.value, secret);

  return opts.next({
    ctx: {
      userId: user.payload.id as User['id'],
      user: user.payload as User,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
