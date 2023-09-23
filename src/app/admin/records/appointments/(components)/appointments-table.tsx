import { DataTable } from '@/components/ui/data-table';
import { AppoinmentColumnType, appointmentColumns } from '../columns';

export default function AppiontmentTable() {
  const data: AppoinmentColumnType[] = [
    {
      id: '1234',
      client: 'John Doe',
      date: '02-02-23',
      product: 'Aircon ni Juan',
      status: 'in progress',
      type: 'installation',
      updated: '02-03-23',
    },
  ];
  return (
    <DataTable
      columns={appointmentColumns}
      data={data}
      hasFilterInput
      filterInputColumn='client'
      filterPlaceholder='Search clients...'
    />
  );
}
