'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import UserPop from '@/components/user-pop';
import { ColumnDef } from '@tanstack/react-table';

export type AppoinmentColumnType = {
  id: string;
  client: string;
  date: string;
  product: string;
  type: string;
  status: 'in progress' | 'pending';
  updated: string;
};

export const appointmentColumns: ColumnDef<AppoinmentColumnType>[] = [
  {
    accessorKey: 'client',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Client' />
    ),
    cell: ({ row }) => (
      <UserPop>
        <p className='font-bold text-primary'>{row.getValue('client')}</p>
      </UserPop>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'product',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product' />
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => <p className='capitalize'>{row.getValue('type')}</p>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <p className='capitalize'>{row.getValue('status')}</p>,
  },
  {
    accessorKey: 'updated',
    header: 'Updated',
  },
];
