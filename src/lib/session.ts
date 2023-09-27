import { cookies } from 'next/headers';

export async function getUser() {
  const cookie = cookies().get('session')?.value;
  if (!cookie) {
    return;
  }

  const res = await fetch(
    `${
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://127.0.0.1:3000'
    }/api/user`,
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
