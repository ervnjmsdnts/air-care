'use client';

import { usePathname } from 'next/navigation';
import DefaultNavbar from './default-nav-bar';
import UserNavbar from './user-nav-bar';
import { UsersColumnType } from '@/app/admin/users/columns';

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.includes('auth')) return children;

  return (
    <>
      {pathname.includes('admin') ? (
        <UserNavbar user={{} as UsersColumnType}>{children}</UserNavbar>
      ) : (
        <>
          <DefaultNavbar />
          {children}
        </>
      )}
    </>
  );
}
