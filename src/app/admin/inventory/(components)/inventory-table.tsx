'use client';

import { DataTable } from '@/components/ui/data-table';
import { inventoryColumns } from '../columns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Inventory, Prisma } from '@prisma/client';
import { CreateProductSchema, createProductSchema } from '@/trpc/schema';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function AddProductButton() {
  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
  });

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { mutate: createProduct } = trpc.createProduct.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  const submit = (data: CreateProductSchema) => {
    createProduct({ ...data });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && setOpen(v)}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className='self-start'>Add Product</Button>
      </DialogTrigger>
      <DialogContent className='grid gap-4'>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <div className='grid gap-2'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' {...form.register('name')} />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='brand'>Brand</Label>
          <Input id='brand' {...form.register('brand')} />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='type'>Type</Label>
          <Input id='type' {...form.register('type')} />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='quantity'>Quantity</Label>
          <Input
            id='quantity'
            type='number'
            {...form.register('quantity', { valueAsNumber: true })}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='price'>Price</Label>
          <Input
            id='price'
            type='number'
            {...form.register('price', { valueAsNumber: true })}
          />
        </div>
        <Button onClick={form.handleSubmit(submit)}>Add</Button>
      </DialogContent>
    </Dialog>
  );
}

export default function InventoryTable({
  products,
}: {
  products: Inventory[];
}) {
  return (
    <div className='flex flex-col h-full gap-2'>
      <AddProductButton />
      <DataTable
        columns={inventoryColumns}
        data={products}
        hasFilterInput
        filterInputColumn='name'
        filterPlaceholder='Search name...'
      />
    </div>
  );
}
