'use client';

import { trpc } from '@/app/_trpc/client';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  IdSchema,
  UpdateProductSchema,
  updateProductSchema,
} from '@/trpc/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Inventory } from '@prisma/client';
import { Row } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import UploadDropzone from './upload-dropzone';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ProductEditDialog({
  detail,
}: {
  detail: Row<Inventory>;
}) {
  const form = useForm<UpdateProductSchema & IdSchema>({
    resolver: zodResolver(updateProductSchema),
  });

  const util = trpc.useContext();

  const { mutate: updateProduct, isLoading } = trpc.updateProduct.useMutation({
    onSuccess: () => {
      util.getProducts.invalidate();
      window.location.reload();
    },
  });

  const submit = async (data: UpdateProductSchema & IdSchema) => {
    updateProduct({ ...data, id: detail.original.id });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit</DialogTitle>
      </DialogHeader>
      <div className='grid gap-4'>
        <UploadDropzone productId={detail.original.id} />
        <div className='grid gap-2'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            defaultValue={detail.original.name}
            {...form.register('name')}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='brand'>Brand</Label>
          <Input
            defaultValue={detail.original.brand}
            id='brand'
            {...form.register('brand')}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='type'>Type</Label>
          <Input
            id='type'
            defaultValue={detail.original.type}
            {...form.register('type')}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='quantity'>Quantity</Label>
          <Input
            id='quantity'
            type='number'
            defaultValue={detail.original.quantity}
            {...form.register('quantity', { valueAsNumber: true })}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='installPrice'>Install Price</Label>
          <Input
            id='installPrice'
            type='number'
            defaultValue={detail.original.installPrice as any}
            {...form.register('installPrice', { valueAsNumber: true })}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='repairPrice'>Repair Price</Label>
          <Input
            id='repairPrice'
            type='number'
            defaultValue={detail.original.repairPrice as any}
            {...form.register('repairPrice', { valueAsNumber: true })}
          />
        </div>
        <Button
          className='self-end'
          disabled={isLoading}
          onClick={form.handleSubmit(submit)}>
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Save'}
        </Button>
      </div>
    </DialogContent>
  );
}
