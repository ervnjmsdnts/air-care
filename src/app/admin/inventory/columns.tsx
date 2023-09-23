'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type InventoryColumnType = {
  id: string;
  name: string;
  brand: string;
  type: string;
  quantity: number;
  price: number;
};

export const inventoryColumns: ColumnDef<InventoryColumnType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Brand' />
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
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));

      const formatted = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
      }).format(price);

      return <div className='font-medium'>{formatted}</div>;
    },
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
