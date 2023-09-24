import UserTable from './(components)/user-table';
import { UsersColumnType } from './columns';

export default async function Users() {
  return (
    <div className='h-full'>
      <UserTable profiles={{} as UsersColumnType[]} />
    </div>
  );
}
