'use client';

import { usePathname } from 'next/navigation';
import DefaultNavbar from './default-nav-bar';
import UserNavbar from './user-nav-bar';
import { Row } from '@/types';

export default function LayoutProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Row<'users'>;
}) {
  const pathname = usePathname();

  if (pathname.includes('auth')) return children;

  return (
    <>
      {pathname.includes('admin') ? (
        <UserNavbar user={user}>{children}</UserNavbar>
      ) : (
        <>
          <DefaultNavbar />
          {children}
        </>
      )}
    </>
  );
}
