'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserPop from '@/components/user-pop';
import { supabase } from '@/lib/supabase';
import { NestedRow, Row } from '@/types';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Audit({ user, label }: { user: Row<'users'>; label: string }) {
  return (
    <Card className='p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <CardHeader className='space-y-0 p-0'>
            <UserPop
              email={user.email}
              name={user.name}
              phoneNumber={user.phone_number}>
              <CardTitle className='text-lg font-semibold text-primary'>
                {user.name}
              </CardTitle>
            </UserPop>
          </CardHeader>
          <CardContent className='p-0'>
            <p className='text-muted-foreground text-sm'>{label}</p>
          </CardContent>
        </div>
        <div className='flex flex-col text-xs text-muted-foreground font-medium'>
          <p>02-01-23</p>
          <p>10:41 PM</p>
        </div>
      </div>
    </Card>
  );
}

export default function LatestAudits({
  audits,
}: {
  audits: NestedRow<'audits', 'users'>[] | null;
}) {
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel('realtime_audits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audits',
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
        {audits?.map((audit) => (
          <Audit key={audit.id} user={audit.users} label={audit.label} />
        ))}
      </CardContent>
    </Card>
  );
}
