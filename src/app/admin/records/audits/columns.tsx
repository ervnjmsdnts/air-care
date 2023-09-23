'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import UserPop from '@/components/user-pop';
import { ColumnDef } from '@tanstack/react-table';

export type AuditColumnType = {
  id: string;
  date: string;
  time: string;
  user: string;
  description: string;
};

export const auditColumn: ColumnDef<AuditColumnType>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'time',
    header: 'Time',
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => (
      <UserPop>
        <p className='text-primary font-semibold'>{row.getValue('user')}</p>
      </UserPop>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Event Description',
  },
];
