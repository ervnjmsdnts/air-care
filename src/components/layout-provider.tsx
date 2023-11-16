'use client';

import { usePathname } from 'next/navigation';
import UserNavbar from './user-nav-bar';

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.includes('auth')) return children;

  const hasUser = pathname.includes('admin') || pathname.includes('inquiry');

  return <>{hasUser ? <UserNavbar>{children}</UserNavbar> : children}</>;
}
