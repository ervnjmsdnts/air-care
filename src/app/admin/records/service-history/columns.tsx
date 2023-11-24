'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import UserPop from '@/components/user-pop';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Appointment, Inventory, User } from '@prisma/client';
import dayjs from 'dayjs';
import TypeBadge from '@/components/type-badge';
import { toPhp } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit } from 'lucide-react';
import UpdateWarranty from './(components)/update-warranty';

export const historyColumns: ColumnDef<
  Appointment & { user: User | null; product: Inventory }
>[] = [
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Client' />
    ),
    filterFn: (row, _, value): any => {
      if (value === undefined || !value) return false;
      return row.original.user?.name.toLowerCase().includes(value);
    },
    cell: ({ row }) => {
      if (!row.original.userId) return <p className='font-bold'>Anonymous</p>;
      return (
        <UserPop
          email={row.original.user!.email}
          name={row.original.user!.name}
          phoneNumber={row.original.user!.phoneNumber}>
          <p className='font-bold text-primary'>{row.original.user!.name}</p>
        </UserPop>
      );
    },
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
  {
    id: 'warranty',
    cell: ({ row }) => {
      if (
        row.original.type !== 'INSTALLATION' &&
        row.original.type !== 'PURCHASE'
      ) {
        return;
      }

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline'>View Warranty</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className='flex items-center gap-1'>
                <DialogTitle>Warranty</DialogTitle>
                <Badge>{row.original.isWarrantyUsed ? 'Used' : 'Valid'}</Badge>
                <UpdateWarranty
                  isWarrantyUsed={row.original.isWarrantyUsed}
                  appointmentId={row.original.id}
                />
              </div>
            </DialogHeader>
            <div className='flex items-center gap-1'>
              <p className='font-semibold'>Customer: </p>
              <p>{row.original.user!.name || 'N/A'}</p>
            </div>
            <div className='flex items-center gap-1'>
              <p className='font-semibold'>Address: </p>
              <p>{row.original.user!.address || 'N/A'}</p>
            </div>
            <div className='flex items-center gap-1'>
              <p className='font-semibold'>Contact Number: </p>
              <p>{row.original.user!.phoneNumber || 'N/A'}</p>
            </div>
            <div className='flex items-center gap-1'>
              <p className='font-semibold'>Item Purchased: </p>
              <p>{row.original.product.name}</p>
            </div>
            <div className='flex items-center gap-1'>
              <p className='font-semibold'>Quanity:</p>
              <p>{row.original.quantity ?? 'Not Applicable'}</p>
            </div>
            <div className='flex items-center gap-1'>
              <p className='font-semibold'>Purchase/Service Date: </p>
              <p>{dayjs(row.original.scheduledDate).format('MMM DD, YYYY')}</p>
            </div>
            <div>
              <p className='font-semibold'>Details: </p>
              <ul className='list-disc pl-8'>
                <li>5 year warranty on Compressor and Parts</li>
                <li>1 year warranty on Services</li>
              </ul>
            </div>
            <div className='flex items-center gap-1'>
              <p className='font-semibold'>Expiration Date: </p>
              <p>
                {dayjs(dayjs(row.original.scheduledDate).add(1, 'year')).format(
                  'MMM DD, YYYY',
                )}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
