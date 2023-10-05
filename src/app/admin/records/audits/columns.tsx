'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import UserPop from '@/components/user-pop';
import { Audit, User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const auditColumn: ColumnDef<Audit & { user: User | null }>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <p>{dayjs(row.original?.createdAt).format('MMM DD YYYY')}</p>
    ),
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => (
      <p>{dayjs(row.original?.createdAt).format('hh:mm A')}</p>
    ),
  },
  {
    accessorKey: 'user',
    filterFn: (row, _, value): any => {
      if (value === undefined || !value) return false;
      return row.original.user?.name.includes(value);
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => (
      <UserPop
        email={row.original!.user?.email}
        name={row.original!.user?.name}
        phoneNumber={row.original!.user?.phoneNumber}>
        <p className='text-primary font-semibold'>{row.original!.user?.name}</p>
      </UserPop>
    ),
  },
  {
    accessorKey: 'label',
    header: 'Event Description',
  },
];
