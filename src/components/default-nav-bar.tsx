'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useRouter } from 'next/navigation';

export default function DefaultNavbar() {
  const router = useRouter();

  return (
    <div className='flex border-b py-4 px-6 justify-between items-center'>
      <h1 className='font-bold text-2xl'>Air Care</h1>
      <div className='flex items-center h-full gap-2'>
        <div className='flex items-center gap-2'>
          <Button asChild variant='ghost'>
            <Link href='/auth'>Log in</Link>
          </Button>
          <Button onClick={() => router.push('/auth?type=sign-up')}>
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}
