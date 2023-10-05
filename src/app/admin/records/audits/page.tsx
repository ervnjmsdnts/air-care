import { serverClient } from '@/app/_trpc/server';
import AuditTable from './(components)/audit-table';

export default async function Audits() {
  const audits = await serverClient.getAudits();

  return (
    <div className='h-full'>
      <AuditTable audits={audits} />
    </div>
  );
}
