'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Image as ImageIcon, MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import UploadDropzone from './(components)/upload-dropzone';
import Image from 'next/image';
import ProductDeleteDialog from './(components)/delete-dialog';
import ProductEditDialog from './(components)/edit-dialog';
import { Inventory } from '@prisma/client';
import { toPhp } from '@/lib/utils';

export const inventoryColumns: ColumnDef<Inventory>[] = [
  {
    id: 'image',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div>
        {!row.original.url ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant='secondary'
                className='flex gap-1 text-secondary-foreground'>
                <ImageIcon className='h-6 w-6' />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UploadDropzone productId={row.original.id} />
            </DialogContent>
          </Dialog>
        ) : (
          <div className='relative aspect-[16/9] w-64'>
            <Image src={row.original.url} alt={row.original.name} fill />
          </div>
        )}
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
  },
  {
    accessorKey: 'installPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Install Price' />
    ),
    cell: ({ row }) => {
      const installPrice = toPhp(row.getValue('installPrice'));

      return <div className='font-medium'>{installPrice}</div>;
    },
  },
  {
    accessorKey: 'repairPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Repair Price' />
    ),
    cell: ({ row }) => {
      const repairPrice = toPhp(row.getValue('repairPrice'));
      return <div className='font-medium'>{repairPrice}</div>;
    },
  },
  {
    accessorKey: 'buyPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Buy Price' />
    ),
    cell: ({ row }) => {
      const buyPrice = toPhp(row.getValue('buyPrice'));
      return <div className='font-medium'>{buyPrice}</div>;
    },
  },
  {
    accessorKey: 'cleanPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Clean Price' />
    ),
    cell: ({ row }) => {
      const cleanPrice = toPhp(row.getValue('cleanPrice'));
      return <div className='font-medium'>{cleanPrice}</div>;
    },
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
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <ProductEditDialog detail={row} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className='flex flex-row gap-2 items-center'>
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
              <ProductDeleteDialog rowId={row.original.id} />
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
