import { DataTable } from '@/components/ui/data-table';
import { InventoryColumnType, inventoryColumns } from '../columns';

export default function InventoryTable() {
  const data: InventoryColumnType[] = [
    {
      id: '1234',
      brand: 'Ferrari',
      name: 'Aircon ni Juan',
      price: 1234.87,
      quantity: 10,
      type: 'Split Type Aircon',
    },
  ];

  return (
    <DataTable
      columns={inventoryColumns}
      data={data}
      hasFilterInput
      filterInputColumn='name'
      filterPlaceholder='Search name...'
    />
  );
}
