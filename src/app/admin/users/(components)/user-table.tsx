'use client';

import { DataTable } from '@/components/ui/data-table';
import { userColumns } from '../columns';
import React, { useMemo } from 'react';
import { User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { CSVLink } from 'react-csv';

export default function UserTable({
  users,
  userId,
}: {
  users: User[];
  userId: string | undefined;
}) {
  const csvData = useMemo(
    () =>
      users.map((user) => ({
        Name: user.name,
        'Email Address': user.email,
        'Phone Number': user.phoneNumber.toString(),
        Address: user.address,
        Role: user.role,
      })),
    [users],
  );

  return (
    <div className='flex flex-col gap-2 h-full'>
      <Button className='self-end' asChild>
        <CSVLink data={csvData} filename='user-data.csv'>
          Export CSV
        </CSVLink>
      </Button>
      <DataTable
        data={users}
        columns={userColumns({ userId: userId })}
        hasFilterInput
        filterPlaceholder='Search emails...'
        filterInputColumn='email'
      />
    </div>
  );
}
