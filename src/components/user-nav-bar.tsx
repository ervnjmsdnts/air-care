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
  Eye,
  EyeOff,
  FileQuestion,
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
import { ElementType, useEffect, useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import dayjs from 'dayjs';
import { Skeleton } from './ui/skeleton';
import { useForm } from 'react-hook-form';
import {
  ChangePasswordSchema,
  UpdateUserSchema,
  changePasswordSchema,
  updateUserSchema,
} from '@/trpc/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from './ui/use-toast';
import { supabase } from '@/lib/supabase';
import Logo from './logo';
import { cn } from '@/lib/utils';

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
      {
        href: 'special-request',
        label: 'Special Requests',
        Icon: FileQuestion,
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

function AdminNotification() {
  const util = trpc.useContext();

  const { data: notifications, isLoading } =
    trpc.getAdminNotifications.useQuery();
  const { mutate: archiveNotification } =
    trpc.archiveAdminNotification.useMutation({
      onSuccess: () => {
        util.getNotifications.invalidate();
      },
    });

  const hasNewNotifications = notifications?.some((n) => n.type === 'NEW');

  useEffect(() => {
    const channel = supabase
      .channel('realtime_audits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'AdminNotification',
        },
        (payload) => {
          util.getAdminNotifications.invalidate();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [util]);

  const pathname = usePathname();

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
            <Bell
              className={cn(
                'h-5 w-5',
                pathname.includes('inquiry') && 'text-[#1da9c1]',
              )}
            />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className='w-96' align='end'>
        {notifications && notifications.length !== 0 ? (
          <div className='grid gap-2'>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn('rounded-lg flex gap-4 border-b p-2')}>
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

function Notification() {
  const util = trpc.useContext();

  const { data: notifications, isLoading } = trpc.getNotifications.useQuery();
  const { data: user } = trpc.getCurrentUser.useQuery();
  const { mutate: archiveNotification } = trpc.archiveNotification.useMutation({
    onSuccess: () => {
      util.getNotifications.invalidate();
    },
  });

  const router = useRouter();

  const hasNewNotifications = notifications?.some((n) => n.type === 'NEW');

  useEffect(() => {
    const channel = supabase
      .channel('realtime_audits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Notification',
        },
        (payload) => {
          util.getNotifications.invalidate();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [util, user?.id]);
  const pathname = usePathname();

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
            <Bell
              className={cn(
                'h-5 w-5',
                pathname.includes('inquiry') && 'text-[#1da9c1]',
              )}
            />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className='w-96' align='end'>
        {notifications && notifications.length !== 0 ? (
          <div className='grid gap-2'>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  'rounded-lg flex gap-4 border-b p-2 hover:bg-zinc-50 cursor-pointer',
                  !notif.isAppointment && 'hover:bg-white cursor-default',
                )}
                onClick={() =>
                  !notif.isAppointment
                    ? null
                    : router.push(
                        `/inquiry/my-appointments/${notif.appointmentId}`,
                      )
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
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePassword = (
    type: 'oldPassword' | 'newPassword' | 'confirmPassword',
  ) => {
    setShowPassword((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const { data: user } = trpc.getCurrentUser.useQuery();
  async function logOut() {
    await fetch('/api/user', { method: 'POST' });
    router.replace('/auth');
  }

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
  });
  const passwordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const [editInputs, setEditInputs] = useState({
    name: false,
    phoneNumber: false,
    address: false,
  });

  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      form.setValue('name', user?.name);
      form.setValue('phoneNumber', user?.phoneNumber);
      form.setValue('address', user?.address);
    }
  }, [user?.name, user?.address, user?.phoneNumber, user?.id, form]);

  const { mutate: updateCurrentUser } = trpc.updateCurrentUser.useMutation({
    onSuccess: () => {
      router.refresh();
      window.location.reload();
    },
  });

  const { mutate: changePassword } = trpc.changePassword.useMutation({
    onSuccess: () => {
      router.refresh();
      window.location.reload();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Incorrect old password',
      });
    },
  });

  const submit = (data: UpdateUserSchema) => {
    updateCurrentUser({ ...data });
  };
  const changeSubmit = (data: ChangePasswordSchema) => {
    changePassword({ ...data });
  };

  const pathname = usePathname();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>
              <User
                className={cn(pathname.includes('inquiry') && 'text-[#1da9c1]')}
              />
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
                  disabled={!editInputs.name}
                  {...form.register('name')}
                />
                <Button
                  variant='outline'
                  onClick={() =>
                    editInputs.name
                      ? form.handleSubmit(submit)()
                      : setEditInputs((prev) => ({ ...prev, name: true }))
                  }>
                  {editInputs.name ? 'Save' : 'Edit'}
                </Button>
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
                  disabled={!editInputs.phoneNumber}
                  {...form.register('phoneNumber')}
                />
                <Button
                  variant='outline'
                  onClick={() =>
                    editInputs.phoneNumber
                      ? form.handleSubmit(submit)()
                      : setEditInputs((prev) => ({
                          ...prev,
                          phoneNumber: true,
                        }))
                  }>
                  {editInputs.phoneNumber ? 'Save' : 'Edit'}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor='address'>Address</Label>
              <div className='flex items-center gap-2'>
                <Input
                  id='address'
                  placeholder='Enter address...'
                  disabled={!editInputs.address}
                  {...form.register('address')}
                />
                <Button
                  variant='outline'
                  onClick={() =>
                    editInputs.address
                      ? form.handleSubmit(submit)()
                      : setEditInputs((prev) => ({ ...prev, address: true }))
                  }>
                  {editInputs.address ? 'Save' : 'Edit'}
                </Button>
              </div>
            </div>
          </div>
          <Separator />
          <h2 className='font-semibold'>Change Password</h2>
          <div className='flex flex-col gap-2'>
            <div>
              <Label htmlFor='old-password'>Old Password</Label>
              <div>
                <div className='flex gap-1'>
                  <Input
                    id='old-password'
                    placeholder='Enter old password...'
                    type={showPassword.oldPassword ? 'text' : 'password'}
                    error={passwordForm.formState.errors.oldPassword}
                    {...passwordForm.register('oldPassword')}
                  />
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => togglePassword('oldPassword')}>
                    {showPassword.oldPassword ? (
                      <EyeOff className='stroke-1 h-5 w-5' />
                    ) : (
                      <Eye className='stroke-1 h-5 w-5' />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.oldPassword ? (
                  <span className='text-xs text-red-500'>
                    {passwordForm.formState.errors.oldPassword.message}
                  </span>
                ) : null}
              </div>
            </div>
            <div>
              <Label htmlFor='new-password'>New Password</Label>
              <div>
                <div className='flex gap-1'>
                  <Input
                    id='new-password'
                    placeholder='Enter new password...'
                    error={passwordForm.formState.errors.newPassword}
                    type={showPassword.newPassword ? 'text' : 'password'}
                    {...passwordForm.register('newPassword')}
                  />
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => togglePassword('newPassword')}>
                    {showPassword.newPassword ? (
                      <EyeOff className='stroke-1 h-5 w-5' />
                    ) : (
                      <Eye className='stroke-1 h-5 w-5' />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.newPassword ? (
                  <span className='text-xs text-red-500'>
                    {passwordForm.formState.errors.newPassword.message}
                  </span>
                ) : null}
              </div>
            </div>
            <div>
              <Label htmlFor='confirm-new-password'>Confirm New Password</Label>
              <div>
                <div className='flex gap-1'>
                  <Input
                    id='confirm-new-password'
                    placeholder='Enter confirmation password...'
                    error={passwordForm.formState.errors.confirmPassword}
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    {...passwordForm.register('confirmPassword')}
                  />
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => togglePassword('confirmPassword')}>
                    {showPassword.confirmPassword ? (
                      <EyeOff className='stroke-1 h-5 w-5' />
                    ) : (
                      <Eye className='stroke-1 h-5 w-5' />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.confirmPassword ? (
                  <span className='text-xs text-red-500'>
                    {passwordForm.formState.errors.confirmPassword.message}
                  </span>
                ) : null}
              </div>
            </div>
            <Button
              onClick={passwordForm.handleSubmit(changeSubmit)}
              className='self-end'
              variant='outline'>
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

  const isUserInquiry = pathname.includes('inquiry');

  return (
    <div className='flex flex-col w-full h-full'>
      <div
        className={cn(
          'flex border-b py-4 px-6 justify-between items-center',
          isUserInquiry && 'bg-[#1da9c1] text-white',
        )}>
        {isUserInquiry ? (
          <Link href='/'>
            <Logo
              className={cn('text-6xl p-0', isUserInquiry && 'text-white')}
            />
          </Link>
        ) : (
          <h1 className='font-bold text-2xl'>Air Care</h1>
        )}
        {/* <h1 className='font-bold text-2xl'>Air Care</h1> */}
        <div className='flex gap-3 items-center'>
          {isUserInquiry ? (
            <>
              {pathname.includes('special-request') ? (
                <Button variant='link' asChild>
                  <Link
                    href='/inquiry'
                    className={cn(isUserInquiry && 'text-white')}>
                    Inquiry
                  </Link>
                </Button>
              ) : (
                <Button variant='link' asChild>
                  <Link
                    href='/inquiry/special-request'
                    className={cn(isUserInquiry && 'text-white')}>
                    Special Request
                  </Link>
                </Button>
              )}
              {pathname.includes('other-services') ? (
                <Button variant='link' asChild>
                  <Link
                    href='/inquiry'
                    className={cn(isUserInquiry && 'text-white')}>
                    Purchase
                  </Link>
                </Button>
              ) : (
                <Button variant='link' asChild>
                  <Link
                    href='/inquiry/other-services'
                    className={cn(isUserInquiry && 'text-white')}>
                    Other Services
                  </Link>
                </Button>
              )}
              {pathname.includes('my-appointments') ? (
                <Button variant='link' asChild>
                  <Link
                    href='/inquiry'
                    className={cn(isUserInquiry && 'text-white')}>
                    Inquiry
                  </Link>
                </Button>
              ) : (
                <Button variant='link' asChild>
                  <Link
                    href='/inquiry/my-appointments'
                    className={cn(isUserInquiry && 'text-white')}>
                    My Appointments
                  </Link>
                </Button>
              )}
            </>
          ) : null}
          {isUserInquiry ? <Notification /> : <AdminNotification />}
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
