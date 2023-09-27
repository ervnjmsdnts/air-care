'use client';

import { DataTable } from '@/components/ui/data-table';
import { auditColumn } from '../columns';
import { NestedRow } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuditTable({
  audits,
}: {
  audits: NestedRow<'audits', 'users'>[];
}) {
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel('realtime_audits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audits',
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

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
