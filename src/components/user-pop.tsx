'use client';

import { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Contact2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserPop({
  children,
  name = 'John Doe',
  email = 'johndoe@gmail.com',
  phoneNumber = '0912-345-6789',
}: {
  children: ReactNode;
  name?: string;
  email?: string;
  phoneNumber?: string;
}) {
  const router = useRouter();
  return (
    <Popover>
      <PopoverTrigger asChild className='cursor-pointer'>
        {children}
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='flex flex-col'>
          <p className='font-medium'>{name}</p>
          <p className='text-muted-foreground text-sm'>{email}</p>
          <p className='text-muted-foreground text-xs'>{phoneNumber}</p>
          <Separator className='my-2' />
          <div
            onClick={() =>
              router.push(`/admin/records/service-history?search=${name}`)
            }
            className='flex justify-end'>
            <Button size='sm' className='flex items-center gap-2'>
              <Contact2 size={20} /> History
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
