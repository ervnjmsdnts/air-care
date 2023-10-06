'use client';

import { trpc } from '@/app/_trpc/client';
import BaseDeleteDialog from '@/components/base-delete-dialog';

export default function ProductDeleteDialog({ rowId }: { rowId: string }) {
  const { mutate: deleteProduct, isLoading } = trpc.deleteProduct.useMutation({
    onSuccess: () => window.location.reload(),
  });

  return (
    <BaseDeleteDialog
      isLoading={isLoading}
      onClick={() => deleteProduct({ id: rowId })}
    />
  );
}
