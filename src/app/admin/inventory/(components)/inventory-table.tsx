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
import { CreateProductSchema, createProductSchema } from '@/trpc/schema';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Inventory } from '@prisma/client';
import { useRouter } from 'next/navigation';

function AddProductButton() {
  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate: createProduct, isLoading } = trpc.createProduct.useMutation({
    onSuccess: () => {
      setOpen(false);

      router.refresh();
      window.location.reload();
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
        <div className='grid grid-cols-4 gap-2'>
          <div className='grid gap-2'>
            <Label htmlFor='installPrice'>Install Price</Label>
            <Input
              id='installPrice'
              type='number'
              {...form.register('installPrice', { valueAsNumber: true })}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='repairPrice'>Repair Price</Label>
            <Input
              id='repairPrice'
              type='number'
              {...form.register('repairPrice', { valueAsNumber: true })}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='buyPrice'>Buy Price</Label>
            <Input
              id='buyPrice'
              type='number'
              {...form.register('buyPrice', { valueAsNumber: true })}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='cleanPrice'>Clean Price</Label>
            <Input
              id='cleanPrice'
              type='number'
              {...form.register('cleanPrice', { valueAsNumber: true })}
            />
          </div>
        </div>
        <Button disabled={isLoading} onClick={form.handleSubmit(submit)}>
          {isLoading ? <Loader2 className='animate-spin w-4 h-4' /> : 'Add'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function InventoryTable({
  inventory,
}: {
  inventory: Inventory[];
}) {
  return (
    <div className='flex flex-col h-full gap-2'>
      <AddProductButton />
      <DataTable
        data={inventory}
        columns={inventoryColumns}
        hasFilterInput
        filterInputColumn='name'
        filterPlaceholder='Search name...'
      />
    </div>
  );
}
