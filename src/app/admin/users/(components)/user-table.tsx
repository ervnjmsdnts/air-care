'use client';

import { DataTable } from '@/components/ui/data-table';
import { UsersColumnType, userColumns } from '../columns';
import React, { useState } from 'react';
import UserEditDialog from './edit-dialog';
import UserDeleteDialog from './delete-dialog';

export default function UserTable({
  profiles,
}: {
  profiles: UsersColumnType[];
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <DataTable
      data={profiles}
      columns={userColumns({
        EditDialog: UserEditDialog as () => React.JSX.Element,
        DeleteDialog: UserDeleteDialog,
      })}
      hasFilterInput
      filterPlaceholder='Search emails...'
      filterInputColumn='email'
    />
  );
}
