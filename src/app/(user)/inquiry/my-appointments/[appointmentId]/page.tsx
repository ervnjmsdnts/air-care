'use client';

import { trpc } from '@/app/_trpc/client';
import StatusBadge from '@/components/status-badge';
import TypeBadge from '@/components/type-badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn, toPhp } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Appointment, AppointmentHours, AppointmentType } from '@prisma/client';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { CalendarIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  scheduleDate: z.date().optional(),
  hours: z.enum(['MORNING', 'AFTERNOON']),
});

type Schema = z.infer<typeof schema>;

export default function SpecificAppointment({
  params,
}: {
  params: { appointmentId: string };
}) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const watchScheduledDate = form.watch('scheduleDate');
  const watchHours = form.watch('hours');

  const { data: appointment } = trpc.getUserAppointment.useQuery({
    id: params.appointmentId,
  });
  const { data: appointments } = trpc.getAppointments.useQuery();

  const util = trpc.useContext();

  const { mutate: setScheduleDate, isLoading: scheduleLoading } =
    trpc.setScheduleDate.useMutation({
      onSuccess: () => util.getUserAppointment.invalidate(),
    });

  const submit = (data: Schema) => {
    setScheduleDate({
      id: params.appointmentId,
      scheduleDate: data.scheduleDate?.toString(),
      hours: data.hours,
    });
  };

  const canScheduleTime = (
    type: AppointmentType,
    appointments: Appointment[],
    scheduledDate: Date | undefined,
    hours: AppointmentHours,
  ): boolean => {
    if (type === 'INSTALLATION' && scheduledDate) {
      const existingAppointment = appointments.find(
        (appointment) =>
          appointment.scheduledDate &&
          appointment.scheduledDate.getTime() === scheduledDate.getTime() &&
          appointment.hours === hours,
      );

      if (existingAppointment) {
        return false;
      }
    } else if ((type === 'CLEANING' || type === 'REPAIR') && scheduledDate) {
      const sameDateAppointment = appointments.filter(
        (appointment) =>
          appointment.scheduledDate &&
          appointment.scheduledDate.getTime() === scheduledDate.getTime() &&
          (appointment.type === 'CLEANING' || appointment.type === 'REPAIR'),
      );

      if (sameDateAppointment.length >= 5) {
        return false;
      }
    } else {
      return true;
    }

    return true;
  };

  return (
    <div className='max-w-6xl pb-4 mx-auto'>
      {appointment && appointments && appointments.length !== 0 ? (
        <div className='flex gap-8 justify-start items-start'>
          <div className='grid sm:grid-cols-4 gap-3 w-full'>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={appointment.status !== 'DONE'}
                      variant='outline'>
                      View Warranty
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Warranty</DialogTitle>
                    </DialogHeader>
                    <div className='flex items-center gap-1'>
                      <p className='font-semibold'>Customer: </p>
                      <p>{appointment.user!.name}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <p className='font-semibold'>Address: </p>
                      <p>{appointment.user!.address}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <p className='font-semibold'>Contact Number: </p>
                      <p>{appointment.user!.phoneNumber}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <p className='font-semibold'>Item Purchased: </p>
                      <p>{appointment.product.name}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <p className='font-semibold'>Quanity:</p>
                      <p>{appointment.quantity ?? 'Not Applicable'}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <p className='font-semibold'>Purchase/Service Date: </p>
                      <p>
                        {dayjs(appointment.scheduledDate).format(
                          'MMM DD, YYYY',
                        )}
                      </p>
                    </div>
                    <div>
                      <p className='font-semibold'>Details: </p>
                      <ul className='list-disc pl-8'>
                        <li>5 year warranty on Compressor and Parts</li>
                        <li>1 year warranty on Services</li>
                      </ul>
                    </div>
                  </DialogContent>
                </Dialog>
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
                <CardTitle className='text-lg'>Scheduled Date & Time</CardTitle>
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
                      <Controller
                        control={form.control}
                        name='hours'
                        render={({ field }) => (
                          <Select
                            disabled={
                              appointment.status !== 'APPROVED' ||
                              Boolean(appointment.hours) ||
                              !watchScheduledDate
                            }
                            onValueChange={field.onChange}
                            defaultValue={appointment.hours ?? field.value}>
                            <SelectTrigger
                              className={cn(
                                !field.value && 'text-muted-foreground',
                              )}>
                              <SelectValue placeholder='Select a time' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Times</SelectLabel>
                                <SelectItem
                                  disabled={
                                    !canScheduleTime(
                                      appointment.type,
                                      appointments.map((a) => ({
                                        ...a,
                                        createdAt: new Date(a.createdAt),
                                        updatedAt: new Date(a.updatedAt),
                                        scheduledDate: new Date(
                                          a.scheduledDate!,
                                        ),
                                      })),
                                      watchScheduledDate,
                                      'MORNING',
                                    )
                                  }
                                  value='MORNING'>
                                  7AM - 11AM
                                </SelectItem>
                                <SelectItem
                                  value='AFTERNOON'
                                  disabled={
                                    !canScheduleTime(
                                      appointment.type,
                                      appointments.map((a) => ({
                                        ...a,
                                        createdAt: new Date(a.createdAt),
                                        updatedAt: new Date(a.updatedAt),
                                        scheduledDate: new Date(
                                          a.scheduledDate!,
                                        ),
                                      })),
                                      watchScheduledDate,
                                      'AFTERNOON',
                                    )
                                  }>
                                  12PM - 5PM
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Button
                        onClick={form.handleSubmit(submit)}
                        disabled={
                          Boolean(appointment.scheduledDate) ||
                          Boolean(appointment.hours) ||
                          appointment.status !== 'APPROVED' ||
                          scheduleLoading ||
                          !watchHours
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
