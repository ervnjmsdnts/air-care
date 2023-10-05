'use client';

import { DataTable } from '@/components/ui/data-table';
import { userColumns } from '../columns';
import React from 'react';
import { User } from '@prisma/client';

export default function UserTable({
  users,
  userId,
}: {
  users: User[];
  userId: string | undefined;
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
