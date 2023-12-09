'use client';

import { DataTable } from '@/components/ui/data-table';
import { appointmentColumns } from '../columns';
import { Appointment, Inventory, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { toPhp } from '@/lib/utils';
import dayjs from 'dayjs';
import { CSVLink } from 'react-csv';

export default function AppiontmentTable({
  appointments,
}: {
  appointments: (Appointment & { user: User | null; product: Inventory })[];
}) {
  const csvData = useMemo(
    () =>
      appointments.map((appointment) => ({
        Client: appointment.user?.name,
        Product: appointment.product.name,
        Type: appointment.type,
        Status: appointment.status,
        Location: appointment.user?.address,
        Price: toPhp(appointment.price),
        'Date Issued': dayjs(appointment.createdAt).format('MMM DD, YYYY'),
        'Scheduled Date': appointment.scheduledDate
          ? dayjs(appointment.scheduledDate).format('MMM DD, YYYY')
          : '',
        'Scheduled Time':
          appointment.hours === 'MORNING'
            ? '7AM - 11AM'
            : appointment.hours === 'AFTERNOON'
            ? '12PM - 5PM'
            : '',
      })),
    [appointments],
  );

  return (
    <div className='flex flex-col gap-2 h-full'>
      <Button className='self-end' asChild>
        <CSVLink data={csvData} filename='appointments-data.csv'>
          Export CSV
        </CSVLink>
      </Button>
      <DataTable
        columns={appointmentColumns}
        data={appointments.map((a) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
          user: {
            ...a.user!,
            createdAt: new Date(a.user ? a.user.createdAt : a.createdAt),
            updatedAt: new Date(a.user ? a.user.updatedAt : a.updatedAt),
          },
        }))}
        hasFilterInput
        filterInputColumn='user'
        filterPlaceholder='Search clients...'
      />
    </div>
  );
}
