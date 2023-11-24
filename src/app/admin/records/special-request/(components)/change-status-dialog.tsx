import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusSchema, statusSchema } from '@/trpc/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'DENIED', 'DONE']),
});

type Schema = z.infer<typeof schema>;

export default function ChangeStatusDialog({
  defaultStatus,
  requestId,
}: {
  defaultStatus: string;
  requestId: string;
}) {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const router = useRouter();

  const { mutate: updateSpecialRequest } =
    trpc.updateSpecialRequest.useMutation({
      onSuccess: () => {
        router.refresh();
        window.location.reload();
      },
    });

  const submit = (data: Schema) => {
    updateSpecialRequest({ status: data.status, id: requestId });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Change Status</DialogTitle>
      </DialogHeader>
      <div className='grid gap-4'>
        <div>
          <Label htmlFor='status'>Status</Label>
          <Controller
            control={form.control}
            name='status'
            render={({ field }) => (
              <Select
                defaultValue={defaultStatus}
                onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='PENDING'>Pending</SelectItem>
                    <SelectItem value='APPROVED'>Approved</SelectItem>
                    <SelectItem value='DENIED'>Denied</SelectItem>
                    <SelectItem value='DONE'>Done</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <Button
          onClick={form.handleSubmit(submit)}
          className='justify-self-end'>
          Save
        </Button>
      </div>
    </DialogContent>
  );
}
