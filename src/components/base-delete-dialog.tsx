'use client';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter } from '@/components/ui/dialog';

export default function BaseDeleteDialog({
  rowId,
  onClick,
}: {
  rowId: string;
  onClick: () => void;
}) {
  return (
    <DialogContent>
      <p>Are you sure you want to delete this?</p>
      <DialogFooter>
        <Button variant='outline' onClick={onClick}>
          Yes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
