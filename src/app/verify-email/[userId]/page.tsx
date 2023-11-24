import Logo from '@/components/logo';
import { db } from '@/db';
import { notFound } from 'next/navigation';
import VerifyContent from '../(components)/verify-content';

export default async function InvitePage({
  params,
}: {
  params: { userId: string; groupId: string };
}) {
  const { userId } = params;

  const user = await db.user.findFirst({ where: { id: userId } });

  if (!user || !user.id) return notFound();

  return (
    <div className='flex justify-center items-center h-full w-full'>
      <div className='space-y-2 text-center'>
        <div className='flex items-center justify-center gap-2'>
          <Logo className='text-9xl p-0' />
        </div>
        <VerifyContent userId={user.id} />
      </div>
    </div>
  );
}
