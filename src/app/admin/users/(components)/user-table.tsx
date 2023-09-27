'use client';

import { DataTable } from '@/components/ui/data-table';
import { userColumns } from '../columns';
import React from 'react';
import { Row } from '@/types';

export default function UserTable({
  users,
  userId,
}: {
  users: Row<'users'>[];
  userId: number | undefined;
}) {
  return (
    <>
      <DataTable
        data={users}
        columns={userColumns({ userId: userId })}
        hasFilterInput
        filterPlaceholder='Search emails...'
        filterInputColumn='email'
      />
    </>
  );
}
