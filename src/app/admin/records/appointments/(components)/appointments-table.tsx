'use client';

import { DataTable } from '@/components/ui/data-table';
import { appointmentColumns } from '../columns';
import { trpc } from '@/app/_trpc/client';
import TableSkeleton from '@/components/table-skeleton';

export default function AppiontmentTable() {
  const { data: appointments, isLoading } = trpc.getAppointments.useQuery();

  return (
    <>
      {appointments && appointments.length !== 0 ? (
        <>
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
        </>
      ) : isLoading ? (
        <TableSkeleton />
      ) : (
        <div>No content</div>
      )}
    </>
  );
}
