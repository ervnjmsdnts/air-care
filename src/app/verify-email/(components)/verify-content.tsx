'use client';

import { trpc } from '@/app/_trpc/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyContent({ userId }: { userId: string }) {
  const router = useRouter();

  const handleRedirect = () => {
    setTimeout(() => {
      router.replace('/auth');
    }, 3000); // 3000 milliseconds = 3 seconds
  };

  // const { isLoading } = trpc.verifyEmail.useQuery(
  //   {
  //     userId,
  //   },
  //   { onSuccess: () => handleRedirect() },
  // );

  return (
    <div>
      {true ? (
        <p className='text-2xl flex items-end gap-1'>
          Verifying Email Adress
          <span className='h-1 w-1 mb-2 bg-black rounded-full animate-pulse [animation-delay:-0.3s]'></span>
          <span className='h-1 w-1 mb-2 bg-black rounded-full animate-pulse [animation-delay:-0.15s]'></span>
          <span className='h-1 w-1 mb-2 bg-black rounded-full animate-pulse'></span>
        </p>
      ) : (
        <div className='flex flex-col gap-4 items-center'>
          <h2 className='text-2xl font-semibold'>Email Verified</h2>
          <div className='flex items-center gap-1.5'>
            <Loader2 className='h-4 w-4 animate-spin' /> Redirecting
          </div>
        </div>
      )}
    </div>
  );
}
