'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UpdateWarranty({
  appointmentId,
  isWarrantyUsed,
}: {
  appointmentId: string;
  isWarrantyUsed: boolean;
}) {
  const router = useRouter();
  const { mutate: updateWarranty } = trpc.updateWarrant.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size='icon' className='border-none' variant='outline'>
          <Edit2 className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Warranty Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => updateWarranty({ appointmentId })}
          disabled={isWarrantyUsed}>
          Set to Used
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
