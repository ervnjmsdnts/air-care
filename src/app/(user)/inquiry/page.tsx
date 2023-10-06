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
import { cn, toPhp } from '@/lib/utils';
import { Inventory } from '@prisma/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

function Product({ product }: { product: Inventory }) {
  const [selectedBadge, setSelectedBadge] = useState<
    'install' | 'repair' | 'purchase'
  >('purchase');
  const [currQuantity, setCurrQuantity] = useState(1);

  const selectedPrice =
    selectedBadge === 'install'
      ? product.installPrice
      : selectedBadge === 'repair'
      ? product.repairPrice
      : product.buyPrice;

  const inquiryPrice =
    selectedBadge === 'purchase' ? selectedPrice * currQuantity : selectedPrice;

  return (
    <Sheet>
      <div className='grid gap-2'>
        <div className='relative aspect-video'>
          <Image fill src={product.url!} alt='Test' className='rounded-lg' />
        </div>
        <div>
          <h4 className='font-semibold text-zinc-800'>{product.name}</h4>
          <h3 className='font-semibold text-sm text-zinc-700'>
            {toPhp(selectedPrice)}
          </h3>
        </div>
        <div className='flex gap-2 items-center'>
          <Badge
            onClick={() => setSelectedBadge('install')}
            className={cn(
              'bg-white hover:bg-gray-200 border-gray-600 text-gray-600 cursor-pointer',
              selectedBadge === 'install' &&
                'bg-gray-600 border-none hover:bg-gray-600/80 text-white',
            )}>
            Installation
          </Badge>
          <Badge
            onClick={() => setSelectedBadge('repair')}
            className={cn(
              'bg-white hover:bg-green-100 border-green-600 text-green-600 cursor-pointer',
              selectedBadge === 'repair' &&
                'bg-green-600 border-none text-white hover:bg-green-600/80',
            )}>
            Repair
          </Badge>
          <Badge
            onClick={() => setSelectedBadge('purchase')}
            className={cn(
              'bg-white hover:bg-primary/20 text-primary border-primary cursor-pointer',
              selectedBadge === 'purchase' &&
                'bg-primary text-primary-foreground border-none hover:bg-primary/80',
            )}>
            Purchase
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
            {selectedBadge === 'purchase' ? (
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
          <Button>Confirm</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Inquiry() {
  const { data: products, isLoading } = trpc.getProducts.useQuery();
  const parseDate = (dateString: string) => {
    return new Date(dateString);
  };

  return (
    <div className='max-w-6xl mx-auto'>
      {products && products.length !== 0 ? (
        <div className='grid grid-cols-4 gap-8'>
          {products.map((product) => (
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
        <div>Loading...</div>
      ) : (
        <div>Nothing to display...</div>
      )}
    </div>
  );
}
