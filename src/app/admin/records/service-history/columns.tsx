'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import UserPop from '@/components/user-pop';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Appointment, User } from '@prisma/client';
import dayjs from 'dayjs';
import TypeBadge from '@/components/type-badge';
import { toPhp } from '@/lib/utils';

export const historyColumns: ColumnDef<Appointment & { user: User }>[] = [
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Client' />
    ),
    filterFn: (row, _, value): any => {
      if (value === undefined || !value) return false;
      return row.original.user?.name.toLowerCase().includes(value);
    },
    cell: ({ row }) => (
      <UserPop
        email={row.original.user.email}
        name={row.original.user.name}
        phoneNumber={row.original.user.phoneNumber}>
        <p className='font-bold text-primary'>{row.original.user.name}</p>
      </UserPop>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Start Date',
    cell: ({ row }) => (
      <p>{dayjs(row.original.createdAt).format('MMM DD, YYYY')}</p>
    ),
  },
  {
    accessorKey: 'scheduledDate',
    header: 'End Date',
    cell: ({ row }) => (
      <p>{dayjs(row.original.scheduledDate).format('MMM DD, YYYY')}</p>
    ),
  },
  {
    accessorKey: 'product.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product' />
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row }) => (
      <p>{row.original.quantity ? row.original.quantity : 'Not Applicable'}</p>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => <TypeBadge type={row.original.type} />,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const price = toPhp(row.getValue('price'));

      return <div className='font-medium'>{price}</div>;
    },
  },
];
