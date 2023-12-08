'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useUploadThing } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { File, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  paymentType: z.enum(['CASH', 'CHEQUE']),
  receivedFrom: z.string().min(1),
  amount: z.number().min(1),
  for: z.string().min(1),
  paymentAmount: z.number().min(1),
  receivedBy: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

function generateRandomReceiptNumber(length: number) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);

  return randomNumber;
}

const receiptNumber = generateRandomReceiptNumber(8);

export default function AddReceipt({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const today = format(new Date(), 'MMM dd, yyyy');
  const form = useForm<Schema>({ resolver: zodResolver(schema) });
  const [file, setFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { startUpload } = useUploadThing('imageUploader');

  const router = useRouter();

  const { mutate: addReceipt } = trpc.addReceipt.useMutation({
    onSuccess: () => {
      form.reset({
        amount: undefined,
        for: '',
        paymentAmount: undefined,
        paymentType: undefined,
        receivedBy: '',
        receivedFrom: '',
      });
      setFile([]);

      setOpen(false);

      router.refresh();
    },
  });

  const { toast } = useToast();

  const submit = async (data: Schema) => {
    setIsLoading(true);
    if (file) {
      const res = await startUpload(file);

      if (!res) {
        return toast({
          variant: 'destructive',
          title: 'Oh uh! Something went wrong',
          description: 'Please try again later',
        });
      }

      const [fileResponse] = res;

      const key = fileResponse.key;
      const url = fileResponse.url;

      if (!key || !url) {
        return toast({
          variant: 'destructive',
          title: 'Oh uh! Something went wrong',
          description: 'Please try again later',
        });
      }

      addReceipt({
        url,
        key,
        amount: data.amount,
        appointmentId,
        for: data.for,
        paymentAmount: data.paymentAmount,
        paymentType: data.paymentType,
        receiptNumber,
        receivedFrom: data.receivedFrom,
        recievedBy: data.receivedBy,
      });
      return setIsLoading(false);
    }

    addReceipt({
      amount: data.amount,
      appointmentId,
      for: data.for,
      paymentAmount: data.paymentAmount,
      paymentType: data.paymentType,
      receiptNumber,
      receivedFrom: data.receivedFrom,
      recievedBy: data.receivedBy,
    });
    return setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray: File[] = Array.from(fileList);
      setFile(filesArray);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Receipt</Button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl'>
        <form onSubmit={form.handleSubmit(submit)} className='w-full'>
          <div className='flex mt-4 justify-between items-start'>
            <h2 className='font-semibold text-lg'>Receipt</h2>
            <div className='text-sm'>
              <p>Receipt Number: {receiptNumber}</p>
              <p>Date: {today}</p>
            </div>
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <div className='grid grid-cols-[1fr_1fr] gap-1 w-full'>
              <div className='flex items-center'>
                <Label
                  htmlFor='receivedFrom'
                  className='text-sm whitespace-nowrap mr-1'>
                  Received From{' '}
                </Label>
                <Input {...form.register('receivedFrom')} id='receivedFrom' />
              </div>
              <div className='flex items-center'>
                <Label
                  htmlFor='amount'
                  className='text-sm whitespace-nowrap mr-1'>
                  the amount of{' '}
                </Label>{' '}
                <Input
                  id='amount'
                  {...form.register('amount', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className='flex items-center'>
              <Label htmlFor='for' className='text-sm whitespace-nowrap mr-1'>
                For
              </Label>{' '}
              <Input id='for' {...form.register('for')} />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2 mt-4'>
            <div className='flex items-center'>
              <Label
                htmlFor='paymentAmount'
                className='text-sm whitespace-nowrap mr-1'>
                Payment Amount:{' '}
              </Label>
              <Input
                id='paymentAmount'
                {...form.register('paymentAmount', { valueAsNumber: true })}
              />
            </div>
            <div className='flex items-center'>
              <Label
                htmlFor='paymentAmount'
                className='text-sm mr-1 whitespace-nowrap'>
                Payment Type:
              </Label>
              <Controller
                control={form.control}
                name='paymentType'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger
                      className={cn(
                        'border border-primary',
                        !field.value && 'text-muted-foreground',
                      )}>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Payment Types</SelectLabel>
                        <SelectItem value='CASH'>Cash</SelectItem>
                        <SelectItem value='CHEQUE'>Cheque</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className='flex mt-4 items-center justify-between'>
            <div className='flex gap-1 items-center'>
              <Button size='sm' asChild variant='outline'>
                <Label htmlFor='image' className='text-sm'>
                  {file && file[0] ? 'Change Image' : 'Add Image'}
                  <input
                    id='image'
                    onChange={handleFileChange}
                    className='hidden'
                    type='file'
                  />
                </Label>
              </Button>
              {file && file[0] ? (
                <div className='flex items-center gap-1'>
                  <File className='w-4 h-4 text-blue-500' />
                  <p className='text-sm font-medium truncate max-w-[200px]'>
                    {file[0].name}
                  </p>
                </div>
              ) : null}
            </div>
            <div className='flex items-center'>
              <Label
                htmlFor='receivedBy'
                className='text-sm whitespace-nowrap mr-1'>
                Recieved By:
              </Label>
              <Input {...form.register('receivedBy')} id='receivedBy' />
            </div>
          </div>
          <div className='flex mt-4 justify-end'>
            <Button disabled={isLoading}>
              {isLoading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
