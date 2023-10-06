'use client';

import { DataTable } from '@/components/ui/data-table';
import { Inventory, inventoryColumns } from '../columns';
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

function AddProductButton() {
  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
  });

  const [open, setOpen] = useState(false);

  const util = trpc.useContext();

  const { mutate: createProduct, isLoading } = trpc.createProduct.useMutation({
    onSuccess: () => {
      setOpen(false);
      util.getProducts.invalidate();
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
        <Button disabled={isLoading} onClick={form.handleSubmit(submit)}>
          {isLoading ? <Loader2 className='animate-spin w-4 h-4' /> : 'Add'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function InventoryTable() {
  const { data: rawInventory } = trpc.getProducts.useQuery();

  const inventory: Inventory[] | undefined = rawInventory?.map((item) => ({
    id: item.id,
    name: item.name,
    url: item.url || null,
    key: item.key || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    quantity: item.quantity,
    brand: item.brand,
    type: item.type,
    installPrice: item.installPrice,
    repairPrice: item.repairPrice,
  }));

  console.log(inventory);

  return (
    <div className='flex flex-col h-full gap-2'>
      {inventory && inventory?.length !== 0 ? (
        <>
          <AddProductButton />
          <DataTable
            data={inventory}
            columns={inventoryColumns}
            hasFilterInput
            filterInputColumn='name'
            filterPlaceholder='Search name...'
          />
        </>
      ) : (
        <div className='flex justify-center'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      )}
    </div>
  );
}
