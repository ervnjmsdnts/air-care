import LatestAppointments from './(components)/latest-appointments';
import LatestAudits from './(components)/latest-audits';
import Statistics from './(components)/statistics';

export default function Dashboard() {
  return (
    <div className=' h-full flex flex-col'>
      <Statistics />
      <div className='grid grid-cols-[1.25fr_0.75fr] flex-grow gap-4 h-full mt-4'>
        <LatestAudits />
        <LatestAppointments />
      </div>
    </div>
  );
}
