'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Login from './(components)/login';
import SignUp from './(components)/sign-up';

export default function Auth() {
  const search = useSearchParams();
  const [isSignup, setIsSignup] = useState<boolean>(
    Boolean(search.get('type')),
  );

  const showSignup = () => setIsSignup(true);
  const showLogin = () => setIsSignup(false);

  return (
    <div className='h-screen relative w-full bg-white'>
      <div className='absolute top-5 left-5'>
        <Button
          asChild
          variant='ghost'
          className='text-2xl font-bold text-primary'>
          <Link href='/'>Air Care</Link>
        </Button>
      </div>
      <div className='grid grid-cols-[1.25fr_0.75fr] h-full'>
        <div className='flex items-center justify-center h-full w-full'>
          <Image
            src='/images/auth.jpg'
            width={400}
            height={400}
            alt='auth'
            className='w-[600px]'
          />
        </div>
        <div className='bg-accent flex justify-center items-center'>
          {isSignup ? (
            <SignUp action={showLogin} />
          ) : (
            <Login action={showSignup} />
          )}
        </div>
      </div>
    </div>
  );
}
