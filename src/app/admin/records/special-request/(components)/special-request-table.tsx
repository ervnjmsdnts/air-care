'use client';

import { DataTable } from '@/components/ui/data-table';
import { SpecialRequest, User } from '@prisma/client';
import { specialRequestColumn } from '../columns';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { CSVLink } from 'react-csv';

export default function SpecialRequestTable({
  requests,
}: {
  requests: (SpecialRequest & { user: User })[];
}) {
  const csvData = useMemo(
    () =>
      requests.map((request) => ({
        User: request.user.name,
        Image: request.url ? request.url : '',
        Brand: request.brand,
        Model: request.model,
        Description: request.description ? request.description : '',
        Status: request.status,
      })),
    [requests],
  );

  return (
    <div className='flex flex-col h-full gap-2'>
      <div className='flex justify-end'>
        <Button asChild>
          <CSVLink data={csvData} filename='special-request.csv'>
            Export CSV
          </CSVLink>
        </Button>
      </div>
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
