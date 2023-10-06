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
import { Row } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import UploadDropzone from './upload-dropzone';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Inventory } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function ProductEditDialog({
  detail,
}: {
  detail: Row<Inventory>;
}) {
  const form = useForm<UpdateProductSchema & IdSchema>({
    resolver: zodResolver(updateProductSchema),
  });

  const router = useRouter();

  const { mutate: updateProduct, isLoading } = trpc.updateProduct.useMutation({
    onSuccess: () => {
      router.refresh();
      window.location.reload();
    },
  });

  const submit = async (data: UpdateProductSchema & IdSchema) => {
    updateProduct({ ...data, id: detail.original.id });
  };

  return (
    <DialogContent className='max-w-4xl'>
      <DialogHeader>
        <DialogTitle>Edit</DialogTitle>
      </DialogHeader>
      <div className='flex gap-4'>
        <div className='w-1/2'>
          <UploadDropzone productId={detail.original.id} />
        </div>
        <div className='w-1/2 grid gap-2'>
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
          <div className='grid grid-cols-3 gap-2'>
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
            <div className='grid gap-2'>
              <Label htmlFor='buyPrice'>Buy Price</Label>
              <Input
                id='buyPrice'
                type='number'
                defaultValue={detail.original.buyPrice as any}
                {...form.register('buyPrice', { valueAsNumber: true })}
              />
            </div>
          </div>
          <Button
            className='w-full'
            disabled={isLoading}
            onClick={form.handleSubmit(submit)}>
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Save'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
