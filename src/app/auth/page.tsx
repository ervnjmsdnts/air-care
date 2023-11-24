'use client';

import { Button } from '@/components/ui/button';
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
      <div className='grid sm:grid-cols-[1.25fr_0.75fr] h-full'>
        <div className='hidden sm:flex items-center justify-center h-full w-full'>
          <div className='min-w-[300px] rounded-lg py-4 px-16 flex flex-col justify-center items-center text-center'>
            <h1 className='text-[#1da9c1] text-[16rem] tracking-tighter leading-[140px] font-cynthe'>
              ac
            </h1>
            <div className='tracking-wider'>
              <p className='text-4xl uppercase font-bold text-primary'>
                MCCD Air Care Trading
              </p>
              <p className='text-4xl uppercase font-bold text-primary'>
                Airconditioning Service
              </p>
            </div>
          </div>
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
