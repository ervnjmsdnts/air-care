import { DataTable } from '@/components/ui/data-table';
import { HistoryColumnType, historyColumns } from '../columns';

export default function HistoryTable() {
  const data: HistoryColumnType[] = [
    {
      id: '12345',
      client: 'John Doe',
      startDate: '02-02-23',
      endDate: '02-12-23',
      product: 'Aircon ni Juan',
      serviceType: 'Installation',
    },
  ];

  return (
    <DataTable
      columns={historyColumns}
      data={data}
      hasFilterInput
      filterInputColumn='client'
      filterPlaceholder='Search clients...'
    />
  );
}
