import { supabase } from '@/lib/supabase';
import LatestAppointments from './(components)/latest-appointments';
import LatestAudits from './(components)/latest-audits';
import Statistics from './(components)/statistics';
import { NestedRow } from '@/types';

export default async function Dashboard() {
  const { data: audits } = await supabase
    .from('audits')
    .select('id, label, created_at, users(*)')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className=' h-full flex flex-col'>
      <Statistics />
      <div className='grid grid-cols-[1.25fr_0.75fr] flex-grow gap-4 h-full mt-4'>
        <LatestAudits
          audits={audits as NestedRow<'audits', 'users'>[] | null}
        />
        <LatestAppointments />
      </div>
    </div>
  );
}
