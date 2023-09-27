'use client';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function UserDeleteDialog({ rowId }: { rowId: number }) {
  const router = useRouter();
  async function deleteRow() {
    await supabase.from('users').delete().eq('id', rowId);
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
