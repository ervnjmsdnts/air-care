'use client';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserPop from '@/components/user-pop';
import { SpecialRequest, User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil } from 'lucide-react';
import Image from 'next/image';
import ChangeStatusDialog from './(components)/change-status-dialog';

export const specialRequestColumn: ColumnDef<
  SpecialRequest & { user: User }
>[] = [
  {
    accessorKey: 'user',
    filterFn: (row, _, value): any => {
      if (value === undefined || !value) return false;
      return row.original.user?.name.toLowerCase().includes(value);
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
    accessorKey: 'url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div>
        {row.original.url ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline'>View Image</Button>
            </DialogTrigger>
            <DialogContent>
              <div className='flex items-center justify-center'>
                <div className='relative aspect-[16/9] w-64'>
                  <Image src={row.original.url} alt={row.original.url} fill />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Brand' />
    ),
  },
  {
    accessorKey: 'model',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Model' />
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <p className='break-words max-w-md'>{row.original.description}</p>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
                  <Pencil className='w-4 h-4' />
                  Change Status
                </DropdownMenuItem>
              </DialogTrigger>
              <ChangeStatusDialog
                requestId={row.original.id}
                defaultStatus={row.original.status}
              />
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
