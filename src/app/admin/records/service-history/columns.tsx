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

export type HistoryColumnType = {
  id: string;
  client: string;
  startDate: string;
  endDate: string;
  product: string;
  serviceType: string;
};

export const historyColumns: ColumnDef<HistoryColumnType>[] = [
  {
    accessorKey: 'client',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Client' />
    ),
    cell: ({ row }) => (
      <UserPop>
        <p className='text-primary font-semibold'>{row.getValue('client')}</p>
      </UserPop>
    ),
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
  },
  {
    accessorKey: 'product',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product' />
    ),
  },
  {
    accessorKey: 'serviceType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
  },
  {
    id: 'action',
    enableSorting: false,
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem className='flex flex-row gap-2 items-center'>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className='flex flex-row gap-2 items-center'>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
