'use client';

import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { cn, toPhp } from '@/lib/utils';
import { AppointmentType, Inventory } from '@prisma/client';
import { ChevronLeft, ChevronRight, Ghost, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

function Product({ product }: { product: Inventory }) {
  const [selectedBadge, setSelectedBadge] =
    useState<AppointmentType>('PURCHASE');
  const [currQuantity, setCurrQuantity] = useState(1);

  const selectedPrice =
    selectedBadge === 'INSTALLATION'
      ? product.installPrice
      : selectedBadge === 'REPAIR'
      ? product.repairPrice
      : selectedBadge === 'CLEANING'
      ? product.cleanPrice
      : product.buyPrice;

  const inquiryPrice =
    selectedBadge === 'PURCHASE' ? selectedPrice * currQuantity : selectedPrice;

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

  function truncateString(str: string, maxLength: number) {
    if (str.length <= maxLength) {
      return str; // Return the original string if it's already shorter or equal to maxLength.
    } else {
      return str.slice(0, maxLength) + '...'; // Truncate the string and append an ellipsis.
    }
  }

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
            {toPhp(selectedPrice)}
          </h3>
        </div>
        <div className='flex gap-2 items-center flex-wrap'>
          <Badge
            onClick={() => setSelectedBadge('INSTALLATION')}
            className={cn(
              'bg-white hover:bg-gray-200 border-gray-600 text-gray-600 cursor-pointer',
              selectedBadge === 'INSTALLATION' &&
                'bg-gray-600 border-none hover:bg-gray-600/80 text-white',
            )}>
            Installation
          </Badge>
          <Badge
            onClick={() => setSelectedBadge('REPAIR')}
            className={cn(
              'bg-white hover:bg-green-100 border-green-600 text-green-600 cursor-pointer',
              selectedBadge === 'REPAIR' &&
                'bg-green-600 border-none text-white hover:bg-green-600/80',
            )}>
            Repair
          </Badge>
          <Badge
            onClick={() => setSelectedBadge('PURCHASE')}
            className={cn(
              'bg-white hover:bg-primary/20 text-primary border-primary cursor-pointer',
              selectedBadge === 'PURCHASE' &&
                'bg-primary text-primary-foreground border-none hover:bg-primary/80',
            )}>
            Purchase
          </Badge>
          <Badge
            onClick={() => setSelectedBadge('CLEANING')}
            className={cn(
              'bg-white hover:bg-blue-400/20 text-blue-400 border-blue-400 cursor-pointer',
              selectedBadge === 'CLEANING' &&
                'bg-blue-400 text-white border-none hover:bg-blue-400/80',
            )}>
            Cleaning
          </Badge>
        </div>
        <SheetTrigger asChild>
          <Button size='sm' className='w-full mt-8'>
            Inquire
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inquire</SheetTitle>
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
            <h2 className='text-lg'>{toPhp(inquiryPrice)}</h2>
            {selectedBadge === 'PURCHASE' ? (
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
              </div>
            ) : null}
          </div>
          <Button
            disabled={isLoading}
            onClick={() =>
              createAppointment({
                price: inquiryPrice,
                type: selectedBadge,
                productId: product.id,
                ...(selectedBadge === 'PURCHASE'
                  ? { quantity: currQuantity }
                  : {}),
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
    <div className='max-w-6xl mx-auto'>
      {products && products.length !== 0 ? (
        <div className='grid grid-cols-4 gap-8'>
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
