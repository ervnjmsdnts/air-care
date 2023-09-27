import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import * as z from 'zod';

const auditPostSchema = z.object({
  label: z.string().min(1),
  userId: z.number().min(1),
});

export async function POST(req: Request) {
  const payload = await req.json();

  const body = auditPostSchema.safeParse(payload);

  if (!body.success) {
    return NextResponse.json({ error: 'Wrong payload' }, { status: 400 });
  }

  await supabase
    .from('audits')
    .insert({ label: body.data.label, user_id: body.data.userId });

  return NextResponse.json({ message: body.data.label }, { status: 200 });
}
