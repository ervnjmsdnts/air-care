import { serverClient } from '@/app/_trpc/server';
import LatestAppointments from './(components)/latest-appointments';
import LatestAudits from './(components)/latest-audits';
import Statistics from './(components)/statistics';

export default async function Dashboard() {
  const audits = await serverClient.getLatestAudits();

  return (
    <div className=' h-full flex flex-col'>
      <Statistics />
      <div className='grid grid-cols-[1.25fr_0.75fr] flex-grow gap-4 h-full mt-4'>
        <LatestAudits audits={audits} />
        <LatestAppointments />
      </div>
    </div>
  );
}
