'use client';

import { trpc } from '@/app/_trpc/client';
import BaseDeleteDialog from '@/components/base-delete-dialog';

export default function ProductDeleteDialog({
  rowId,
  rowKey,
}: {
  rowId: string;
  rowKey: string;
}) {
  const { mutate: deleteProduct } = trpc.deleteProduct.useMutation({
    onSuccess: () => window.location.reload(),
  });

  return (
    <BaseDeleteDialog
      rowId={rowId}
      onClick={() => deleteProduct({ id: rowId, key: rowKey })}
    />
  );
}
