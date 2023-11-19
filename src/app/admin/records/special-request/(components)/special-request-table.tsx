import { DataTable } from '@/components/ui/data-table';
import { SpecialRequest, User } from '@prisma/client';
import { specialRequestColumn } from '../columns';

export default function SpecialRequestTable({
  requests,
}: {
  requests: (SpecialRequest & { user: User })[];
}) {
  return (
    <div className='flex flex-col h-full gap-2'>
      <DataTable
        data={requests}
        columns={specialRequestColumn}
        hasFilterInput
        filterInputColumn='user'
        filterPlaceholder='Search users...'
      />
    </div>
  );
}
