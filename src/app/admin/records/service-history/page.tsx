import { serverClient } from '@/app/_trpc/server';
import HistoryTable from './(components)/history-table';

export default async function ServiceHistory() {
  const doneAppointments = await serverClient.getDoneAppointments();
  return (
    <div className='h-full'>
      <HistoryTable appointments={doneAppointments} />
    </div>
  );
}
