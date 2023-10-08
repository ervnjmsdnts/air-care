'use client';

import {
  Archive,
  Bell,
  ChevronDown,
  ChevronUp,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  Contact2,
  LayoutDashboard,
  LucideProps,
  Package,
  User,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { usePathname, useRouter } from 'next/navigation';
import { ElementType, useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import dayjs from 'dayjs';
import { Skeleton } from './ui/skeleton';

type AdminRouteType = {
  href: string;
  label: string;
  Icon: ElementType<LucideProps>;
  children?: AdminRouteType[];
};

const adminRoutes: AdminRouteType[] = [
  {
    href: 'dashboard',
    label: 'Dashboard',
    Icon: LayoutDashboard,
  },
  {
    href: 'records',
    label: 'Records',
    Icon: Clipboard,
    children: [
      {
        href: 'service-history',
        label: 'Service History',
        Icon: Contact2,
      },
      {
        href: 'audits',
        label: 'Audits',
        Icon: ClipboardCheck,
      },
      {
        href: 'appointments',
        label: 'Appointments',
        Icon: ClipboardList,
      },
    ],
  },
  {
    href: 'users',
    label: 'Users',
    Icon: Users,
  },
  {
    href: 'inventory',
    label: 'Inventory',
    Icon: Package,
  },
];

function AdminNavItem({ label, href, Icon, children }: AdminRouteType) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  return (
    <>
      {children ? (
        <>
          <Button
            className='justify-between'
            variant={pathname.includes(href) ? 'secondary' : 'ghost'}
            onClick={() => setOpen((prev) => !prev)}>
            <div className='flex items-center gap-2'>
              <Icon />
              {label}
            </div>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          {open && (
            <div className='ml-8 flex flex-col gap-2'>
              {children.map((child, index) => (
                <Button
                  key={index}
                  asChild
                  className='justify-start flex gap-2'
                  variant={
                    pathname.includes(child.href) ? 'secondary' : 'ghost'
                  }>
                  <Link href={`/admin/${href}/${child.href}`}>
                    <child.Icon />
                    <p>{child.label}</p>
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <Button
          asChild
          className='justify-start flex gap-2'
          variant={pathname.includes(href) ? 'secondary' : 'ghost'}>
          <Link href={`/admin/${href}`}>
            <Icon />
            <p>{label}</p>
          </Link>
        </Button>
      )}
    </>
  );
}

function Notification() {
  const util = trpc.useContext();

  const { data: notifications, isLoading } = trpc.getNotifications.useQuery();
  const { mutate: archiveNotification } = trpc.archiveNotification.useMutation({
    onSuccess: () => {
      util.getNotifications.invalidate();
    },
  });

  const router = useRouter();

  const hasNewNotifications = notifications?.some((n) => n.type === 'NEW');
  return (
    <Popover>
      <PopoverTrigger className='relative'>
        {hasNewNotifications ? (
          <span className='flex h-3 w-3 z-10 right-0 absolute'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
            <span className='relative inline-flex rounded-full h-3 w-3 bg-primary'></span>
          </span>
        ) : null}
        <Avatar>
          <AvatarFallback>
            <Bell className='h-5 w-5' />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className='w-96' align='end'>
        {notifications && notifications.length !== 0 ? (
          <div className='grid gap-2'>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className='rounded-lg flex gap-4 border-b p-2 hover:bg-zinc-50 cursor-pointer'
                onClick={() =>
                  router.push(`/inquiry/my-appointments/${notif.appointmentId}`)
                }>
                <div className='flex-grow'>
                  <p className='text-sm mb-1'>{notif.message}</p>
                  <p className='text-xs text-zinc-400'>
                    {dayjs(notif.createdAt).format('MMM DD, YYYY')}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  className='p-2 rounded-full'
                  onClick={() =>
                    archiveNotification({ notificationId: notif.id })
                  }>
                  <Archive className='h-5 w-5 text-zinc-500' />
                </Button>
              </div>
            ))}
          </div>
        ) : isLoading ? (
          <div className='grid gap-2'>
            <Skeleton className='rounded-lg h-10 w-full' />
          </div>
        ) : (
          <div>No notifications</div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function UserInfo() {
  const router = useRouter();

  const { data: user } = trpc.getCurrentUser.useQuery();
  async function logOut() {
    await fetch('/api/user', { method: 'POST' });
    router.replace('/auth');
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 m-2'>
          <DialogTrigger asChild>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logOut}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className='flex gap-3 flex-col'>
          <div className='flex flex-col gap-2'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <div className='flex items-center gap-2'>
                <Input
                  id='name'
                  placeholder='Enter name...'
                  value={user?.name}
                  disabled
                />
                <Button variant='outline'>Edit</Button>
              </div>
            </div>
            <div>
              <Label htmlFor='email'>Email Address</Label>
              <Input id='email' value={user?.email} disabled />
            </div>
            <div>
              <Label htmlFor='phone-number'>Phone Number</Label>
              <div className='flex items-center gap-2'>
                <Input
                  id='phone-number'
                  placeholder='Enter phone number...'
                  value={user?.phoneNumber}
                  disabled
                />
                <Button variant='outline'>Edit</Button>
              </div>
            </div>
            <div>
              <Label htmlFor='address'>Address</Label>
              <div className='flex items-center gap-2'>
                <Input
                  id='address'
                  placeholder='Enter address...'
                  value={user?.address}
                  disabled
                />
                <Button variant='outline'>Edit</Button>
              </div>
            </div>
          </div>
          <Separator />
          <h2 className='font-semibold'>Change Password</h2>
          <div className='flex flex-col gap-2'>
            <div>
              <Label htmlFor='old-password'>Old Password</Label>
              <Input
                id='old-password'
                placeholder='Enter old password...'
                type='password'
              />
            </div>
            <div>
              <Label htmlFor='new-password'>New Password</Label>
              <Input
                id='new-password'
                placeholder='Enter new password...'
                type='password'
              />
            </div>
            <Button className='self-end' variant='outline'>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UserNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex border-b py-4 px-6 justify-between items-center'>
        <h1 className='font-bold text-2xl'>Air Care</h1>
        <div className='flex gap-3 items-center'>
          {pathname.includes('inquiry') ? (
            <>
              {pathname.includes('my-appointments') ? (
                <Button variant='link' asChild>
                  <Link href='/inquiry'>Inquiry</Link>
                </Button>
              ) : (
                <Button variant='link' asChild>
                  <Link href='/inquiry/my-appointments'>My Appointments</Link>
                </Button>
              )}
            </>
          ) : null}
          {pathname.includes('inquiry') ? <Notification /> : null}
          <UserInfo />
        </div>
      </div>
      <div className='flex flex-grow h-full'>
        {pathname.includes('admin') ? (
          <div className='w-80 p-6 border-r'>
            <div className='flex flex-col gap-2'>
              {adminRoutes.map((route, index) => (
                <AdminNavItem {...route} key={index} />
              ))}
            </div>
          </div>
        ) : null}
        <main className='p-6 w-full'>{children}</main>
      </div>
    </div>
  );
}
