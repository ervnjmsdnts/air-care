'use client';

import { trpc } from '@/app/_trpc/client';
import TermsConditionsDialog from '@/components/terms-conditions-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { toPhp, truncateString } from '@/lib/utils';
import { Inventory } from '@prisma/client';
import { ChevronLeft, ChevronRight, Ghost, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

function Product({ product }: { product: Inventory }) {
  const [currQuantity, setCurrQuantity] = useState(1);
  const [isAcceptTC, setIsAcceptTC] = useState(false);

  const inquiryPrice = product.buyPrice * currQuantity;

  const { toast } = useToast();

  const { mutate: createAppointment, isLoading } =
    trpc.createAppointment.useMutation({
      onSuccess: () => {
        toast({
          title: 'Appointment has been created',
          description:
            'Your appointment is pending approval. We will notify you when it gets approved.',
        });
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Oh uh! Something went wrong',
          description: 'Please try again later',
        });
      },
    });

  return (
    <Sheet>
      <div className='grid gap-2'>
        <div className='grid place-items-center'>
          <div className='relative aspect-video w-40 '>
            <Image
              fill
              src={product.url || 'https://via.placeholder.com/1280x720'}
              alt='Test'
              className='rounded-lg'
            />
          </div>
        </div>
        <div className='flex flex-col'>
          <p className='font-semibold text-zinc-800'>
            {truncateString(product.name, 24)}
          </p>
          <h3 className='font-semibold text-sm text-zinc-700'>
            {toPhp(product.buyPrice)}
          </h3>
        </div>
        <SheetTrigger asChild>
          <Button size='sm' className='w-full mt-8'>
            Purchase
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Purchase</SheetTitle>
        </SheetHeader>
        <div className='flex py-4 flex-col h-full'>
          <div className='flex-grow flex flex-col gap-1 py-4'>
            <div className='relative aspect-video'>
              <Image
                src={product.url!}
                alt='testing'
                className='rounded-lg'
                fill
              />
            </div>
            <h2 className='text-lg font-bold'>{product.name}</h2>
            <div className='text-sm'>
              <p>
                Brand: <strong>{product.brand}</strong>
              </p>
              <p>
                Type: <strong>{product.type}</strong>
              </p>
            </div>
            <h2 className='text-lg'>{toPhp(inquiryPrice)}</h2>
            <div>
              <p className='text-zinc-800 mb-1 text-sm'>Quantity</p>
              <div className='flex items-center gap-1.5'>
                <Button
                  size='sm'
                  disabled={currQuantity <= 1}
                  variant='outline'
                  onClick={() => {
                    setCurrQuantity((prev) => (prev - 1 > 1 ? prev - 1 : 1));
                  }}
                  className='p-1 h-8'>
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Input
                  value={currQuantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value)) {
                      if (value > product.quantity) {
                        setCurrQuantity(product.quantity);
                      } else {
                        setCurrQuantity(value);
                      }
                    }
                  }}
                  className='h-8 w-12'
                />
                <div className='flex items-center gap-1.5'>
                  <Button
                    disabled={currQuantity >= product.quantity}
                    onClick={() => {
                      setCurrQuantity((prev) =>
                        prev + 1 > product.quantity
                          ? product.quantity
                          : prev + 1,
                      );
                    }}
                    size='sm'
                    variant='outline'
                    className='p-1 h-8'>
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                  <p className='text-zinc-600 text-sm space-x-1'>
                    <span>{product.quantity}</span>
                    <span>available</span>
                  </p>
                </div>
              </div>
              <p className='text-muted-foreground text-xs mt-2'>
                Installation is included
              </p>
              <div className='flex items-center gap-1 mt-4'>
                <Checkbox
                  checked={isAcceptTC}
                  onCheckedChange={() => setIsAcceptTC((prev) => !prev)}
                  id='terms'
                  className='rounded-md'
                />
                <label
                  htmlFor='terms'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  Accept <TermsConditionsDialog />
                </label>
              </div>
            </div>
          </div>
          <Button
            disabled={isLoading || !isAcceptTC}
            onClick={() =>
              createAppointment({
                price: inquiryPrice,
                type: 'PURCHASE',
                productId: product.id,
                quantity: currQuantity,
              })
            }>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Inquiry() {
  const { data: products, isLoading } = trpc.getValidProducts.useQuery();
  const parseDate = (dateString: string) => {
    return new Date(dateString);
  };

  return (
    <div className='max-w-6xl pb-4 mx-auto'>
      {products && products.length !== 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-8'>
          {products?.map((product) => (
            <>
              <Product
                product={{
                  ...product,
                  createdAt: parseDate(product.createdAt),
                  updatedAt: parseDate(product.updatedAt),
                }}
                key={product.id}
              />
            </>
          ))}
        </div>
      ) : isLoading ? (
        <div className='grid grid-cols-4 gap-8'>
          {[...new Array(12)].map((_, index) => (
            <Skeleton key={index} className='h-60 w-full rounded-lg' />
          ))}
        </div>
      ) : (
        <div className='mt-16 flex flex-col items-center gap-2'>
          <Ghost className='h-8 w-8 text-zinc-800' />
          <h3 className='font-semibold text-xl'>No content to display</h3>
        </div>
      )}
    </div>
  );
}
