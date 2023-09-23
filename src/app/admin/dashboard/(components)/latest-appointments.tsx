import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserPop from '@/components/user-pop';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

function Appointment() {
  return (
    <Card className='p-4'>
      <CardContent className='flex h-full p-0 flex-row items-center gap-4'>
        <div className='text-primary text-lg font-bold text-center'>
          <p>02</p>
          <p>Feb</p>
        </div>
        <Separator orientation='vertical' />
        <div className='text-sm'>
          <p className='font-medium text-secondary-foreground'>
            9:00 PM - 11:00 PM
          </p>
          <p className='font-medium text-muted-foreground'>Somewhere</p>
        </div>
        <div className='text-sm'>
          <p className='font-medium text-secondary-foreground'>
            Aircon ni Juan - Installation
          </p>
          <UserPop>
            <p className='font-semibold text-primary'>John Doe</p>
          </UserPop>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LatestAppointments() {
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
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
      </CardContent>
    </Card>
  );
}
