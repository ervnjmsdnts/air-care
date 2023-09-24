'use client';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export default function UserDeleteDialog({ rowId }: { rowId: string }) {
  const router = useRouter();
  async function deleteRow() {
    router.refresh();
  }

  return (
    <DialogContent>
      <p>Are you sure you want to delete this?</p>
      <DialogFooter>
        <Button variant='outline' onClick={deleteRow}>
          Yes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
