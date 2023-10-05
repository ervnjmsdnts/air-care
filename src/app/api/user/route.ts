import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const sessionOption = {
    name: 'session',
    value: 'done',
    maxAge: -1,
  };

  cookies().set(sessionOption);

  return NextResponse.json({}, { status: 200 });
}
