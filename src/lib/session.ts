import { cookies } from 'next/headers';

export async function getUser() {
  const cookie = cookies().get('session')?.value;
  const res = await fetch(
    `${process.env.VERCEL_URL ?? 'http://localhost:3000'}/api/user`,
    {
      method: 'GET',
      headers: { cookie: `jwt=${cookie}` },
    },
  );

  if (!res.ok) {
    return;
  }

  return res.json();
}
