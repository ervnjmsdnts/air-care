'use client';

import { trpc } from '@/app/_trpc/client';
import StatusBadge from '@/components/status-badge';
import TypeBadge from '@/components/type-badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toPhp } from '@/lib/utils';
import { AppointmentStatus, AppointmentType } from '@prisma/client';
import dayjs from 'dayjs';
import { Ghost } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function Appointment({
  type,
  status,
  image,
  name,
  price,
  brand,
  productType,
  quantity,
  createdAt,
  appointmentId,
}: {
  type: AppointmentType;
  status: AppointmentStatus;
  image: string | null;
  name: string;
  price: number;
  brand: string;
  productType: string;
  quantity: number | null;
  createdAt: Date;
  appointmentId: string;
}) {
  const router = useRouter();
  return (
    <div
      className='rounded-lg shadow-md hover:shadow-lg cursor-pointer'
      onClick={() => router.push(`/inquiry/my-appointments/${appointmentId}`)}>
      <div className='p-4'>
        <div className='flex gap-4 items-center'>
          <div className='relative h-20 w-20'>
            <Image
              alt='product'
              src={image || 'https://via.placeholder.com/20x20'}
              fill
              className='object-cover rounded-full'
            />
          </div>
          <div className='text-sm flex flex-col'>
            <h4 className='font-semibold flex items-center gap-2 text-lg'>
              {name}
              {quantity ? (
                <span className='text-xs text-zinc-500'>Qty: {quantity}</span>
              ) : null}
            </h4>
            <p className='font-bold text-lg'>{toPhp(price)}</p>
          </div>
        </div>
      </div>
      <Separator />
      <div className='p-4'>
        <div className='items-center flex justify-between'>
          <div className='flex items-center gap-2'>
            <TypeBadge type={type} />
            <StatusBadge status={status} />
          </div>
          <p className='text-sm text-zinc-400'>
            {dayjs(createdAt).format('MMM DD, YYYY')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MyAppointments() {
  const { data: appointments, isLoading } = trpc.getUserAppointments.useQuery();

  return (
    <div className='max-w-6xl mx-auto'>
      <h3 className='text-lg font-bold mb-4'>My Appointments</h3>
      {appointments && appointments.length !== 0 ? (
        <div className='grid grid-cols-3 gap-4'>
          {appointments.map((appointment) => (
            <Appointment
              appointmentId={appointment.id}
              quantity={appointment.quantity}
              key={appointment.id}
              brand={appointment.product.brand}
              productType={appointment.product.type}
              type={appointment.type}
              status={appointment.status}
              image={appointment.product.url}
              name={appointment.product.name}
              price={appointment.price}
              createdAt={new Date(appointment.createdAt)}
            />
          ))}
        </div>
      ) : isLoading ? (
        <div className='grid grid-cols-3 gap-4'>
          {[...new Array(12)].map((_, index) => (
            <Skeleton key={index} className='w-full rounded-lg h-32' />
          ))}
        </div>
      ) : (
        <div className='mt-16 flex flex-col items-center gap-2'>
          <Ghost className='h-8 w-8 text-zinc-800' />
          <h3 className='font-semibold text-xl'>No content to display</h3>
        </div>
      )}
    </div>
  );
}
