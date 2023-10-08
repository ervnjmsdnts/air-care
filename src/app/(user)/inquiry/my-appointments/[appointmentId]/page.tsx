'use client';

import { trpc } from '@/app/_trpc/client';
import StatusBadge from '@/components/status-badge';
import TypeBadge from '@/components/type-badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn, toPhp } from '@/lib/utils';
import { IdSchema, idSchema } from '@/trpc/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { CalendarIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({ scheduleDate: z.date().optional() });

type Schema = z.infer<typeof schema>;

export default function SpecificAppointment({
  params,
}: {
  params: { appointmentId: string };
}) {
  const { data: appointment } = trpc.getUserAppointment.useQuery({
    id: params.appointmentId,
  });
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const util = trpc.useContext();

  const { mutate: setScheduleDate, isLoading: scheduleLoading } =
    trpc.setScheduleDate.useMutation({
      onSuccess: () => util.getUserAppointment.invalidate(),
    });

  const submit = (data: Schema) => {
    setScheduleDate({
      id: params.appointmentId,
      scheduleDate: data.scheduleDate?.toString(),
    });
  };

  return (
    <div className='max-w-6xl mx-auto'>
      {appointment ? (
        <div className='flex gap-8 justify-start items-start'>
          <div className='grid grid-cols-4 gap-3 w-full'>
            <Card className='col-span-2 row-span-2'>
              <CardContent className='pt-6'>
                <div className='relative aspect-video'>
                  <Image
                    alt='product'
                    className='rounded-lg'
                    src={
                      appointment.product.url ||
                      'https://via.placeholder.com/20x20'
                    }
                    fill
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className='font-medium'>{appointment.product.name}</h3>
                <div className='flex justify-start text-sm items-center gap-1'>
                  <p>{appointment.product.brand}</p>
                  <Separator className='w-2 bg-zinc-600' />
                  <p>{appointment.product.type}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Date Issued</CardTitle>
              </CardHeader>
              <CardContent className='flex gap-2'>
                <p>{dayjs(appointment.createdAt).format('MMM DD, YYYY')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Service Type & Status</CardTitle>
              </CardHeader>
              <CardContent className='flex gap-2'>
                <TypeBadge type={appointment.type} />
                <StatusBadge status={appointment.status} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Warranty</CardTitle>
              </CardHeader>
              <CardContent className='flex gap-2'>
                <Button variant='outline'>View Warranty</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Price</CardTitle>
              </CardHeader>
              <CardContent className='flex gap-2'>
                <p>{toPhp(appointment.price)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Quantity</CardTitle>
              </CardHeader>
              <CardContent className='flex gap-2'>
                <p>{appointment.quantity || 'Not Applicable'}</p>
              </CardContent>
            </Card>
            <Card className='col-span-2'>
              <CardHeader>
                <CardTitle className='text-lg'>Scheduled Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  control={form.control}
                  name='scheduleDate'
                  defaultValue={
                    appointment.scheduledDate as unknown as Date | undefined
                  }
                  render={({ field }) => (
                    <div className='flex gap-2'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            disabled={
                              appointment.status !== 'APPROVED' ||
                              Boolean(appointment.scheduledDate)
                            }
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}>
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) =>
                              date < new Date() ||
                              date < new Date('1900-01-01') ||
                              [0, 6].includes(date.getDay())
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        onClick={form.handleSubmit(submit)}
                        disabled={
                          Boolean(appointment.scheduledDate) ||
                          appointment.status !== 'APPROVED' ||
                          scheduleLoading
                        }>
                        {scheduleLoading ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          'Submit'
                        )}
                      </Button>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      )}
    </div>
  );
}
