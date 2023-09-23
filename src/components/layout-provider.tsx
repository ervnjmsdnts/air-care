'use client';

import { usePathname } from 'next/navigation';
import DefaultNavbar from './default-nav-bar';
import UserNavbar from './user-nav-bar';

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {pathname.includes('auth') && children}
      {pathname.includes('admin') ? (
        <UserNavbar>{children}</UserNavbar>
      ) : (
        <>
          <DefaultNavbar />
          {children}
        </>
      )}
    </>
  );
}
