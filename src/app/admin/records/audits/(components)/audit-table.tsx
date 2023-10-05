'use client';

import { DataTable } from '@/components/ui/data-table';
import { auditColumn } from '../columns';
import { Audit, User } from '@prisma/client';
export default function AuditTable({
  audits,
}: {
  audits: (Audit & { user: User | null })[];
}) {
  return (
    <DataTable
      data={audits}
      columns={auditColumn}
      hasFilterInput
      filterInputColumn='user'
      filterPlaceholder='Search users...'
    />
  );
}
