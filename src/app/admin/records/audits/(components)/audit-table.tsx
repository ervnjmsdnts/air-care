import { DataTable } from '@/components/ui/data-table';
import { AuditColumnType, auditColumn } from '../columns';

export default function AuditTable() {
  const data: AuditColumnType[] = [
    {
      id: '1234',
      date: '02-02-23',
      time: '10:41 PM',
      user: 'John Doe',
      description: 'Logged in to the system',
    },
  ];

  return (
    <DataTable
      data={data}
      columns={auditColumn}
      hasFilterInput
      filterInputColumn='user'
      filterPlaceholder='Search users...'
    />
  );
}
