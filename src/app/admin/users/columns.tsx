'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserPop from '@/components/user-pop';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

export type UsersColumnType = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  role: 'user' | 'admin';
};

export const userColumns: ColumnDef<UsersColumnType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <UserPop>
        <p className='text-primary font-semibold'>{row.getValue('name')}</p>
      </UserPop>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email Address' />
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('role')}</div>,
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
