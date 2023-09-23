import { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Contact2, Mail } from 'lucide-react';

export default function UserPop({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild className='cursor-pointer'>
        {children}
      </PopoverTrigger>
      <PopoverContent>
        <div className='flex flex-col'>
          <p className='font-medium'>John Doe</p>
          <p className='text-muted-foreground'>johndoe@gmail.com</p>
          <p className='text-muted-foreground text-sm'>0912-345-6789</p>
          <Separator className='my-2' />
          <div className='grid grid-cols-2 gap-2'>
            <Button size='sm' className='flex items-center gap-2'>
              <Mail size={20} /> Email
            </Button>
            <Button size='sm' className='flex items-center gap-2'>
              <Contact2 size={20} /> History
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
