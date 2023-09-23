'use client';

import { useRouter } from 'next/navigation';

export default function Admin() {
  const router = useRouter();

  router.push('/admin/dashboard');

  return null;
}
