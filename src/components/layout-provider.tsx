'use client';

import { usePathname } from 'next/navigation';
import DefaultNavbar from './default-nav-bar';
import UserNavbar from './user-nav-bar';
import { User } from '@/types/user';

export default function LayoutProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
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
