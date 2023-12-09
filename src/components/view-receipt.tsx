'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toPhp } from '@/lib/utils';
import { Receipt } from '@prisma/client';
import { format } from 'date-fns';

export default function ViewReceipt({ receipt }: { receipt: Receipt }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Receipt</Button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl'>
        <div className='flex mt-4 justify-between items-start'>
          <h2 className='font-semibold text-lg'>Receipt</h2>
          <div className='text-sm'>
            <p>Receipt Number: {receipt.receiptNumber}</p>
            <p>Date: {format(new Date(receipt.createdAt), 'MMM dd, yyyy')}</p>
          </div>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
          <div className='grid text-sm grid-cols-[1fr_1fr] gap-1 w-full'>
            <div className='flex items-center w-full'>
              <div className='w-full flex items-center gap-1'>
                <p className='whitespace-nowrap font-medium'>Received from</p>
                <p className='border-b w-full border-b-black'>
                  {receipt.receivedFrom}
                </p>
              </div>
            </div>
            <div className='flex items-center'>
              <div className='w-full flex items-center gap-1'>
                <p className='whitespace-nowrap font-medium'>the amount of</p>
                <p className='border-b w-full border-b-black'>
                  {toPhp(receipt.amount)}
                </p>
              </div>
            </div>
          </div>
          <div className='flex text-sm items-center'>
            <div className='w-full flex items-center gap-1'>
              <p className='whitespace-nowrap font-medium'>For</p>
              <p className='border-b w-full border-b-black'>{receipt.for}</p>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 text-sm mt-4'>
          <div className='flex items-center'>
            <div className='w-full flex items-center gap-1'>
              <p className='whitespace-nowrap font-medium'>Payment Amount: </p>
              <p className='border-b w-full border-b-black'>
                {toPhp(receipt.paymentAmount)}
              </p>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='w-full flex items-center gap-1'>
              <p className='whitespace-nowrap font-medium'>Payment Type: </p>
              <p className='border-b w-full border-b-black'>
                {receipt.paymentType}
              </p>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 text-sm mt-4'>
          {receipt.url && receipt.key ? (
            <Button className='place-self-start'>
              <a href={receipt.url} target='_blank'>
                View Image
              </a>
            </Button>
          ) : (
            <div />
          )}
          <div className='flex items-center'>
            <div className='w-full flex items-center gap-1'>
              <p className='whitespace-nowrap font-medium'>Received By: </p>
              <p className='border-b w-full border-b-black'>
                {receipt.receivedBy}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
