import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

const MAX_AGE = 60 * 60 * 24 * 30; // 30 Days

export async function POST(req: Request) {
  const body = await req.json();

  const user = await supabase
    .from('users')
    .select('*')
    .eq('email', body.email)
    .single();

  if (user.error) {
    return NextResponse.json(
      {
        error: 'Account does not exist',
      },
      { status: 400 },
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

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

  return NextResponse.json({}, { status: 200 });
}
