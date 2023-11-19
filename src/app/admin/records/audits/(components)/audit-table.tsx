'use client';

import { DataTable } from '@/components/ui/data-table';
import { auditColumn } from '../columns';
import { Audit, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { CSVLink } from 'react-csv';
export default function AuditTable({
  audits,
}: {
  audits: (Audit & { user: User | null })[];
}) {
  const csvData = useMemo(
    () =>
      audits.map((audit) => ({
        User: audit.user?.name,
        Description: audit.label,
        Date: dayjs(audit.createdAt).format('MMM DD, YYYY'),
        Time: dayjs(audit.createdAt).format('hh:mm A'),
      })),
    [audits],
  );

  return (
    <div className='flex flex-col h-full gap-2'>
      <Button className='self-end' asChild>
        <CSVLink data={csvData} filename='audit-data.csv'>
          Export CSV
        </CSVLink>
      </Button>
      <DataTable
        data={audits}
        columns={auditColumn}
        hasFilterInput
        filterInputColumn='user'
        filterPlaceholder='Search users...'
      />
    </div>
  );
}
