'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Row } from '@tanstack/react-table';
import { UsersColumnType } from '../columns';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string(),
  address: z.string(),
  phone_number: z.string(),
});

type EditUserSchemaType = z.infer<typeof schema>;

export default function UserEditDialog({
  detail,
}: {
  detail: Row<UsersColumnType>;
}) {
  const form = useForm<EditUserSchemaType>({ resolver: zodResolver(schema) });
  const router = useRouter();

  async function submit(formData: EditUserSchemaType) {
    router.refresh();
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
            defaultValue={detail.getValue('phone_number')}
            {...form.register('phone_number')}
          />
        </div>
        <Button className='self-end' onClick={form.handleSubmit(submit)}>
          Save
        </Button>
      </div>
    </DialogContent>
  );
}
