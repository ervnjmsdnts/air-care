import { DataTable } from '@/components/ui/data-table';
import { UsersColumnType, userColumns } from '../columns';

export default function UserTable() {
  const data: UsersColumnType[] = [
    {
      id: '1234',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '1234567890',
      address: 'Somewhere',
      role: 'admin',
    },
    {
      id: '12345',
      name: 'Bob Doe',
      email: 'bobdoe@gmail.com',
      phoneNumber: '1234567890',
      address: 'Somewhere',
      role: 'admin',
    },
  ];

  return (
    <DataTable
      data={data}
      columns={userColumns}
      hasFilterInput
      filterPlaceholder='Search emails...'
      filterInputColumn='email'
    />
  );
}
