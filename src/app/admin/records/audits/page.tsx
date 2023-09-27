import { supabase } from '@/lib/supabase';
import AuditTable from './(components)/audit-table';
import { NestedRow } from '@/types';

export default async function Audits() {
  const { data: audits } = await supabase
    .from('audits')
    .select('id, label, created_at, users(*)')
    .order('created_at', { ascending: false });

  return (
    <div className='h-full'>
      <AuditTable audits={audits as NestedRow<'audits', 'users'>[]} />
    </div>
  );
}
