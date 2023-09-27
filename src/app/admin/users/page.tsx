import { supabase } from '@/lib/supabase';
import UserTable from './(components)/user-table';
import { getUser } from '@/lib/session';
import { Row } from '@/types';

export default async function Users() {
  const { data: users } = await supabase.from('users').select('*');
  const user = await getUser();

  const currentUser = users?.find((u) => u.id === user.id);

  return (
    <div className='h-full'>
      <UserTable users={users as Row<'users'>[]} userId={currentUser?.id} />
    </div>
  );
}
