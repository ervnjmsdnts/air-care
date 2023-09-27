'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import UserPop from '@/components/user-pop';
import { NestedRow } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export type AuditColumnType = {
  id: string;
  date: string;
  time: string;
  user: string;
  label: string;
};

export const auditColumn: ColumnDef<NestedRow<'audits', 'users'> | null>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <p>{dayjs(row.original?.created_at).format('MMM DD YYYY')}</p>
    ),
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => (
      <p>{dayjs(row.original?.created_at).format('hh:mm A')}</p>
    ),
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => (
      <UserPop
        email={row.original?.users.email}
        name={row.original?.users.name}
        phoneNumber={row.original?.users.phone_number}>
        <p className='text-primary font-semibold'>{row.original?.users.name}</p>
      </UserPop>
    ),
  },
  {
    accessorKey: 'label',
    header: 'Event Description',
  },
];
