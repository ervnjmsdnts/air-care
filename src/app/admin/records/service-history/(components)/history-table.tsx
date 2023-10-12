'use client';

import { DataTable } from '@/components/ui/data-table';
import { historyColumns } from '../columns';
import { Appointment, AppointmentType, Inventory, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { cn, toPhp } from '@/lib/utils';
import { Controller, useForm } from 'react-hook-form';
import { ManualEntrySchema, manualEntrySchema } from '@/trpc/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { CSVLink } from 'react-csv';

export default function HistoryTable({
  appointments,
}: {
  appointments: (Appointment & { user: User | null; product: Inventory })[];
}) {
  const [open, setOpen] = useState(false);

  const { data: products } = trpc.getValidProducts.useQuery();

  const csvData = useMemo(
    () =>
      appointments.map((appointment) => ({
        Client: appointment.user?.name,
        'Start Date': dayjs(appointment.createdAt).format('MMM DD, YYYY'),
        'End Date': dayjs(appointment.scheduledDate).format('MMM DD, YYYY'),
        Product: appointment.product.name,
        Quantity: appointment.quantity,
        Type: appointment.type,
        Price: toPhp(appointment.price),
      })),
    [appointments],
  );

  const comboDetails = products?.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const form = useForm<ManualEntrySchema>({
    resolver: zodResolver(manualEntrySchema),
  });

  const router = useRouter();

  const { mutate: createMunualService, isLoading } =
    trpc.createManualService.useMutation({
      onSuccess: () => {
        router.refresh();
        window.location.reload();
      },
    });

  const submit = (data: ManualEntrySchema) => {
    createMunualService({ ...data });
  };

  const typeWatch = form.watch('type');
  const quantityWatch = form.watch('quantity');
  const productWatch = form.watch('productId');

  const calculatePrice = (
    type: AppointmentType,
    productId: string,
    quantity?: number,
  ) => {
    const product = products?.find((p) => p.id === productId);
    if (type === 'CLEANING') {
      return product!.cleanPrice;
    } else if (type === 'INSTALLATION') {
      return product!.installPrice;
    } else if (type === 'REPAIR') {
      return product!.repairPrice;
    } else if (type === 'PURCHASE') {
      return product!.buyPrice! * quantity!;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    form.setValue(
      'price',
      calculatePrice(typeWatch, productWatch, quantityWatch),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculatePrice, productWatch, quantityWatch, typeWatch]);

  return (
    <div className='flex flex-col h-full gap-2'>
      <div className='flex items-center justify-between'>
        <Dialog>
          <DialogTrigger asChild>
            <Button className=''>Manual Entry</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manual Entry</DialogTitle>
            </DialogHeader>
            <div className='grid gap-3'>
              <div className='grid gap-2'>
                <Label>Product</Label>
                <Controller
                  name='productId'
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={open}
                            className='w-full justify-between'>
                            {field.value
                              ? comboDetails?.find(
                                  (comboDetail) =>
                                    comboDetail.value === field.value,
                                )?.label
                              : 'Select product...'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-full p-0'>
                          <Command>
                            <CommandInput placeholder='Search product...' />
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandGroup>
                              {comboDetails?.map((comboDetail) => (
                                <CommandItem
                                  key={comboDetail.value}
                                  value={comboDetail.value}
                                  onSelect={() => {
                                    form.setValue(
                                      'productId',
                                      comboDetail.value,
                                    );
                                  }}>
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === comboDetail.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {comboDetail.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='service'>Service Type</Label>
                <Controller
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('type', value as AppointmentType);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='INSTALLATION'>
                            Installation
                          </SelectItem>
                          <SelectItem value='REPAIR'>Repair</SelectItem>
                          <SelectItem value='PURCHASE'>Purchase</SelectItem>
                          <SelectItem value='CLEANING'>Cleaning</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {typeWatch === 'PURCHASE' ? (
                <div className='grid gap-2'>
                  <Label htmlFor='quantity'>Quantity</Label>
                  <Input
                    id='quantity'
                    type='number'
                    defaultValue={undefined}
                    {...form.register('quantity', { valueAsNumber: true })}
                  />
                </div>
              ) : null}
              <div className='grid gap-2'>
                <Label htmlFor='price'>Price</Label>
                <Controller
                  control={form.control}
                  name='price'
                  defaultValue={calculatePrice(
                    typeWatch,
                    productWatch,
                    quantityWatch,
                  )}
                  render={({ field }) => (
                    <Input
                      disabled
                      id='price'
                      type='number'
                      value={calculatePrice(
                        typeWatch,
                        productWatch,
                        quantityWatch,
                      )}
                    />
                  )}
                />
              </div>
              <Button disabled={isLoading} onClick={form.handleSubmit(submit)}>
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button asChild>
          <CSVLink data={csvData} filename='service-history-data.csv'>
            Export CSV
          </CSVLink>
        </Button>
      </div>
      <DataTable
        columns={historyColumns}
        data={appointments.map((a) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
          user: {
            ...a.user!,
            createdAt: new Date(a.user?.createdAt || ''),
            updatedAt: new Date(a.user?.updatedAt || ''),
          },
          product: {
            ...a.product,
            createdAt: new Date(a.product.createdAt),
            updatedAt: new Date(a.product.updatedAt),
          },
        }))}
        hasFilterInput
        filterInputColumn='user'
        filterPlaceholder='Search clients...'
      />
    </div>
  );
}
