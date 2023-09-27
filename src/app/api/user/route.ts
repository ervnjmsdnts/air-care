import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest): Promise<any> {
  const value = req.cookies.get('jwt')?.value;

  if (!value) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  try {
    const user = await jose.jwtVerify(value, secret);

    return Response.json(user?.payload?.data);
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
