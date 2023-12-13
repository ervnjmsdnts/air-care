import LatestAppointments from './(components)/latest-appointments';
import LatestAudits from './(components)/latest-audits';
import SalesChart from './(components)/sales-chart';
import Statistics from './(components)/statistics';

export default async function Dashboard() {
  return (
    <div className='h-full flex flex-col'>
      <Statistics />
      <SalesChart />
      <div className='grid grid-cols-[1.25fr_0.75fr] gap-4 h-full mt-4'>
        <LatestAudits />
        <LatestAppointments />
      </div>
    </div>
  );
}
