'use client';

import { trpc } from '@/app/_trpc/client';
import LatestSkeleton from '@/components/latest-skeleton';
import TypeBadge from '@/components/type-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserPop from '@/components/user-pop';
import { supabase } from '@/lib/supabase';
import { truncateString } from '@/lib/utils';
import { AppointmentType, User } from '@prisma/client';
import dayjs from 'dayjs';
import { ArrowRight, Ghost } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Appointment({
  createdAt,
  productName,
  type,
  user,
}: {
  createdAt: Date;
  location: string;
  productName: string;
  type: AppointmentType;
  user: User;
}) {
  return (
    <Card className='p-4'>
      <CardContent className='flex h-full p-0 flex-row items-center gap-4'>
        <div className='text-primary text-lg font-bold text-center'>
          <p>{dayjs(createdAt).format('DD')}</p>
          <p>{dayjs(createdAt).format('MMM')}</p>
        </div>
        <Separator orientation='vertical' />
        <div className='text-sm w-[100px]'>
          <p className='font-medium text-secondary-foreground'>
            {dayjs(createdAt).format('hh:mm A')}
          </p>
          {/* <p className='font-medium text-muted-foreground truncate'>
            {user.address}
          </p> */}
        </div>
        <div className='text-sm'>
          <p className='font-medium text-secondary-foreground'>
            {truncateString(productName, 30)}
          </p>
          <span>
            <TypeBadge type={type} />
          </span>
          <UserPop
            email={user.email}
            name={user.name}
            phoneNumber={user.phoneNumber}>
            <p className='font-semibold text-primary'>{user.name}</p>
          </UserPop>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LatestAppointments() {
  const { data: appointments, isLoading } =
    trpc.getLatestAppointments.useQuery();

  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel('realtime_audits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Appointment',
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
        <CardTitle className='font-medium text-xl'>
          Latest Appointments
        </CardTitle>
        <Button
          variant='link'
          className='flex gap-2 font-medium items-center'
          asChild>
          <Link href='/admin/records/appointments'>
            More <ArrowRight size={14} />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 overflow-y-auto h-0 flex-grow'>
        {appointments && appointments.length !== 0 ? (
          <>
            {appointments?.map((appointment) => (
              <Appointment
                key={appointment.id}
                createdAt={new Date(appointment.createdAt)}
                location={appointment.user!.address}
                productName={appointment.product.name}
                type={appointment.type}
                user={{
                  ...appointment.user!,
                  createdAt: new Date(appointment.user!.createdAt),
                  updatedAt: new Date(appointment.user!.updatedAt),
                }}
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
