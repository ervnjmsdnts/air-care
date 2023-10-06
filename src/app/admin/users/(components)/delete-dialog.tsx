'use client';

import { trpc } from '@/app/_trpc/client';
import BaseDeleteDialog from '@/components/base-delete-dialog';
import { useRouter } from 'next/navigation';

export default function UserDeleteDialog({ rowId }: { rowId: string }) {
  const router = useRouter();
  const { mutate: deleteUser, isLoading } = trpc.deleteUser.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <BaseDeleteDialog
      isLoading={isLoading}
      onClick={() => deleteUser({ id: rowId })}
    />
  );
}
