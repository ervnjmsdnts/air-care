import SpecialRequestTable from './(components)/special-request-table';
import { serverClient } from '@/app/_trpc/server';

export default async function SpecialRequest() {
  const requests = await serverClient.getSpecialRequests();
  return (
    <div className='h-full'>
      <SpecialRequestTable requests={requests} />
    </div>
  );
}
