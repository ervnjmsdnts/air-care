'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Row } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { User } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import {
  UpdateUserSchema,
  UserIdSchema,
  updateUserSchema,
} from '@/trpc/schema';
import { Loader2 } from 'lucide-react';

export default function UserEditDialog({
  detail,
}: {
  detail: Row<User | null>;
}) {
  const form = useForm<UpdateUserSchema & UserIdSchema>({
    resolver: zodResolver(updateUserSchema),
  });
  const router = useRouter();

  const { mutate: updateUser, isLoading } = trpc.updateUser.useMutation({
    onSuccess: () => router.refresh(),
  });

  async function submit(formData: UpdateUserSchema & UserIdSchema) {
    updateUser({ ...formData, id: detail.original!.id });
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit</DialogTitle>
      </DialogHeader>
      <div className='flex flex-col gap-2'>
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            defaultValue={detail.getValue('name')}
            {...form.register('name')}
          />
        </div>
        <div>
          <Label htmlFor='address'>Address</Label>
          <Input
            id='address'
            defaultValue={detail.getValue('address')}
            {...form.register('address')}
          />
        </div>
        <div>
          <Label htmlFor='phoneNumber'>Phone Number</Label>
          <Input
            id='phoneNumber'
            defaultValue={detail.getValue('phoneNumber')}
            {...form.register('phoneNumber')}
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
