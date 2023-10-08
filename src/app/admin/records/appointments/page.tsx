import { serverClient } from '@/app/_trpc/server';
import AppiontmentTable from './(components)/appointments-table';

export default async function Appointments() {
  const appointments = await serverClient.getAppointments();
  return (
    <div className='h-full'>
      <AppiontmentTable appointments={appointments} />
    </div>
  );
}
