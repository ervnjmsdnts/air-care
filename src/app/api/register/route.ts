import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const exist = await supabase
    .from('users')
    .select('email')
    .eq('email', body.email)
    .single();

  if (exist.data) {
    return NextResponse.json(
      { error: 'Account already exists' },
      { status: 400 },
    );
  }

  const user = await supabase
    .from('users')
    .insert({ ...body })
    .select()
    .limit(1);

  return NextResponse.json(user);
}
