'use client';

import { trpc } from '@/app/_trpc/client';
import BaseDeleteDialog from '@/components/base-delete-dialog';
import { useRouter } from 'next/navigation';

export default function UserDeleteDialog({ rowId }: { rowId: string }) {
  const router = useRouter();
  const { mutate: deleteUser } = trpc.deleteUser.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <BaseDeleteDialog rowId={rowId} onClick={() => deleteUser({ id: rowId })} />
  );
}
