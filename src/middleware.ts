import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export default async function middleware(req: NextRequest) {
  const cookie = cookies().get('session');

  const pathname = req.nextUrl.pathname;

  const value = cookie?.value as string;

  if (!value) return;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  if ((pathname.includes('admin') || pathname.includes('inquiry')) && !value) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  try {
    const user = (await jose.jwtVerify(value, secret)) as any;

    if (
      user &&
      (pathname === '/' || pathname === '/auth') &&
      user?.payload?.role === 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    if (
      user &&
      (pathname === '/' || pathname === '/auth') &&
      user.payload?.role === 'USER'
    ) {
      return NextResponse.redirect(new URL('/inquiry', req.url));
    }
  } catch (e: unknown) {
    console.log(e);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};
