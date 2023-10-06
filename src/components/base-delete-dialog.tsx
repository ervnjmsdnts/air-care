'use client';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export default function BaseDeleteDialog({
  onClick,
  isLoading,
}: {
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <DialogContent>
      <p>Are you sure you want to delete this?</p>
      <DialogFooter>
        <Button disabled={isLoading} variant='outline' onClick={onClick}>
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Yes'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
