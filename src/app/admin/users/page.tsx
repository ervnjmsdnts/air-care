import UserTable from './(components)/user-table';
import { serverClient } from '@/app/_trpc/server';

export const dynamic = 'force-dynamic';

export default async function Users() {
  const users = await serverClient.getUsers();
  const user = await serverClient.getCurrentUser();

  const currentUser = users?.find((u) => u.id === user?.id);

  return (
    <div className='h-full'>
      <UserTable users={users} userId={currentUser?.id} />
    </div>
  );
}
