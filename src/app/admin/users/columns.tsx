'use client';

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
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import UserEditDialog from './(components)/edit-dialog';
import React from 'react';
import UserDeleteDialog from './(components)/delete-dialog';
import { User } from '@prisma/client';

export function userColumns({
  userId,
}: {
  userId: string | undefined;
}): ColumnDef<User | null>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      cell: ({ row }) => (
        <UserPop
          email={row.original?.email}
          name={row.original?.name}
          phoneNumber={row.original?.phoneNumber}>
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
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('role')}</div>
      ),
    },
    {
      id: 'action',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        if (userId === row.original?.id) return;
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
                    Edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <UserEditDialog detail={row} />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className='flex flex-row gap-2 items-center'>
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
                <UserDeleteDialog rowId={row.original!.id} />
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
