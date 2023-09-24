'use client';

import { DataTable } from '@/components/ui/data-table';
import { UsersColumnType, userColumns } from '../columns';
import React from 'react';

export default function UserTable({
  users,
  userId,
}: {
  users: UsersColumnType[];
  userId: string;
}) {
  return (
    <DataTable
      data={users}
      columns={userColumns({ userId: userId })}
      hasFilterInput
      filterPlaceholder='Search emails...'
      filterInputColumn='email'
    />
  );
}
