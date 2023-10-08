'use client';

import { DataTable } from '@/components/ui/data-table';
import { appointmentColumns } from '../columns';
import { Appointment, User } from '@prisma/client';

export default function AppiontmentTable({
  appointments,
}: {
  appointments: (Appointment & { user: User })[];
}) {
  return (
    <DataTable
      columns={appointmentColumns}
      data={appointments.map((a) => ({
        ...a,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
        user: {
          ...a.user,
          createdAt: new Date(a.user.createdAt),
          updatedAt: new Date(a.user.updatedAt),
        },
      }))}
      hasFilterInput
      filterInputColumn='user'
      filterPlaceholder='Search clients...'
    />
  );
}
