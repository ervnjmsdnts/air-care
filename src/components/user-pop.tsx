import { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Contact2, Mail } from 'lucide-react';

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
  return (
    <Popover>
      <PopoverTrigger asChild className='cursor-pointer'>
        {children}
      </PopoverTrigger>
      <PopoverContent>
        <div className='flex flex-col'>
          <p className='font-medium'>{name}</p>
          <p className='text-muted-foreground'>{email}</p>
          <p className='text-muted-foreground text-sm'>{phoneNumber}</p>
          {/* <Separator className='my-2' />
          <div className='grid grid-cols-2 gap-2'>
            <Button size='sm' className='flex items-center gap-2'>
              <Mail size={20} /> Email
            </Button>
            <Button size='sm' className='flex items-center gap-2'>
              <Contact2 size={20} /> History
            </Button>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
