import { db } from '@/db';
import PasswordForm from '../_components/password-form';
import { notFound } from 'next/navigation';

export default async function ResetPassword({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;

  const user = await db.user.findFirst({ where: { id: userId } });

  if (!user || !user.id) return notFound();

  return (
    <div className='h-full'>
      <div className='flex flex-col items-center justify-center h-full  p-4 space-y-4 antialiased text-gray-900 bg-gray-100'>
        <div className='w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16'>
          <h1 className=' mb-6 text-3xl font-bold text-center'>
            Reset Password
          </h1>
          <p className='text-center mx-12'>
            Boost security now. Enter your new password, and click &apos;Update
            Password&apos; to save.
          </p>
          <PasswordForm userId={userId} />
        </div>
      </div>
    </div>
  );
}
