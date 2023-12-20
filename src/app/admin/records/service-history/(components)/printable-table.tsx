import { DataTable } from '@/components/ui/data-table';
import { Appointment, Inventory, Receipt, User } from '@prisma/client';
import { historyColumns } from '../columns';
import { forwardRef } from 'react';

type PrintType = {
  appointments: (Appointment & {
    user: User | null;
    product: Inventory;
    receipt: Receipt | null;
  })[];
  search: string | null;
};

const PrintableTable = forwardRef<HTMLDivElement, PrintType>(
  ({ appointments, search }, ref) => {
    return (
      <div className='hidden'>
        <div ref={ref}>
          <DataTable
            columns={historyColumns}
            data={appointments.map((a) => ({
              ...a,
              createdAt: new Date(a.createdAt),
              updatedAt: new Date(a.updatedAt),
              user: {
                ...a.user!,
                createdAt: new Date(a.user?.createdAt || ''),
                updatedAt: new Date(a.user?.updatedAt || ''),
              },
              product: {
                ...a.product,
                createdAt: new Date(a.product.createdAt),
                updatedAt: new Date(a.product.updatedAt),
              },
            }))}
            search={search as string | undefined}
            maxItems
          />
        </div>
      </div>
    );
  },
);

PrintableTable.displayName = 'PrintableTable';

export default PrintableTable;
