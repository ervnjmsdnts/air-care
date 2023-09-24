import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { User } from '@/types/user';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const value = req.cookies.get('jwt')?.value;

  if (!value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  try {
    const user = (await jose.jwtVerify(value, secret)) as User;

    return NextResponse.json(user?.payload?.data);
  } catch (e: unknown) {
    console.log(e);
  }
}

export async function POST(req: NextRequest) {
  const sessionOption = {
    name: 'session',
    value: 'done',
    maxAge: -1,
  };

  cookies().set(sessionOption);

  return NextResponse.json({}, { status: 200 });
}
