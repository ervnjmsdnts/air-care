'use client';

import { trpc } from '@/app/_trpc/client';
import LatestSkeleton from '@/components/latest-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserPop from '@/components/user-pop';
import { supabase } from '@/lib/supabase';
import dayjs from 'dayjs';
import { ArrowRight, Ghost } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Audit({
  createdAt,
  email,
  phoneNumber,
  name,
  label,
}: {
  createdAt: Date;
  email: string;
  name: string;
  phoneNumber: string;
  label: string;
}) {
  return (
    <Card className='p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <CardHeader className='space-y-0 p-0'>
            <UserPop email={email} name={name} phoneNumber={phoneNumber}>
              <CardTitle className='text-lg font-semibold text-primary'>
                {name}
              </CardTitle>
            </UserPop>
          </CardHeader>
          <CardContent className='p-0'>
            <p className='text-muted-foreground text-sm'>{label}</p>
          </CardContent>
        </div>
        <div className='flex flex-col text-xs text-muted-foreground font-medium'>
          <p>{dayjs(createdAt).format('MMM DD, YYYY')}</p>
          <p>{dayjs(createdAt).format('hh:mm A')}</p>
        </div>
      </div>
    </Card>
  );
}

export default function LatestAudits() {
  const { data: audits, isLoading } = trpc.getLatestAudits.useQuery();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel('realtime_audits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Audit',
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='font-medium text-xl'>Latest Audits</CardTitle>
        <Button
          asChild
          variant='link'
          className='flex gap-2 font-medium items-center'>
          <Link href='/admin/records/audits'>
            More <ArrowRight size={14} />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 overflow-y-auto h-0 flex-grow'>
        {audits && audits.length !== 0 ? (
          <>
            {audits?.map((audit) => (
              <Audit
                key={audit.id}
                email={audit.user?.email || ''}
                name={audit.user?.name || ''}
                phoneNumber={audit.user?.phoneNumber || ''}
                createdAt={new Date(audit.createdAt)}
                label={audit.label}
              />
            ))}
          </>
        ) : isLoading ? (
          <>
            {[...new Array(7)].map((_, index) => (
              <div className='grid gap-2' key={index}>
                <LatestSkeleton />
              </div>
            ))}
          </>
        ) : (
          <div className='self-center gap-2 mt-6 flex flex-col items-center'>
            <Ghost className='h-8 w-8 text-zinc-600' />
            <p className='text-center text-zinc-800 font-semibold'>
              No content
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
