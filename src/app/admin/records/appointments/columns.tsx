'use client';

import StatusBadge from '@/components/status-badge';
import TypeBadge from '@/components/type-badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserPop from '@/components/user-pop';
import { Appointment, User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import ChangeStatusDialog from './(components)/change-status-dialog';
import { toPhp } from '@/lib/utils';

export const appointmentColumns: ColumnDef<Appointment & { user: User }>[] = [
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
    accessorKey: 'product.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product' />
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'user.address',
    header: 'Location',
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
  {
    accessorKey: 'createdAt',
    header: 'Date Issued',
    cell: ({ row }) => (
      <p>{dayjs(row.original.createdAt).format('MMM DD, YYYY')}</p>
    ),
  },
  {
    accessorKey: 'scheduledDate',
    header: 'Scheduled Date',
    cell: ({ row }) => (
      <p>
        {row.original.scheduledDate
          ? dayjs(row.original.scheduledDate).format('MMM DD, YYYY')
          : ''}
      </p>
    ),
  },
  {
    accessorKey: 'hours',
    header: 'Scheduled Time',
    cell: ({ row }) => (
      <p>
        {row.original.hours === 'MORNING'
          ? '7AM - 11AM'
          : row.original.hours === 'AFTERNOON'
          ? '12PM - 5PM'
          : ''}
      </p>
    ),
  },
  {
    id: 'action',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className='flex flex-row gap-2 items-center'>
                  <Pencil />
                  Change Status
                </DropdownMenuItem>
              </DialogTrigger>
              <ChangeStatusDialog
                appointmentId={row.original.id}
                defaultStatus={row.original.status}
              />
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
