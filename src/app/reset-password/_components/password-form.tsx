'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
  .object({
    password: z.string().min(8, { message: 'Minimum of 8 characters' }),
    confirmPassword: z.string().min(1, 'Field is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type Schema = z.infer<typeof schema>;

export default function PasswordForm({ userId }: { userId: string }) {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePassword = (type: 'password' | 'confirmPassword') => {
    setShowPassword((prev) => ({ ...prev, [type]: !prev[type] }));
  };
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const router = useRouter();

  const { toast } = useToast();

  const { mutate: resetPassword, isLoading } = trpc.resetPassword.useMutation({
    onSuccess: () => {
      toast({
        title: 'Reset Password',
        description: 'Password has been updated',
      });

      return router.replace('/auth');
    },
    onError: () =>
      toast({
        title: 'Reset Password',
        variant: 'destructive',
        description: 'Something went wrong',
      }),
  });

  const submit = (data: Schema) => {
    resetPassword({ userId, password: data.password });
  };

  return (
    <div className='space-y-6 w-ful'>
      <div className='space-y-3'>
        <div className='flex gap-1'>
          <Input
            type={showPassword.password ? 'text' : 'password'}
            placeholder='New Password'
            error={form.formState.errors.password}
            {...form.register('password')}
          />
          <Button
            variant='outline'
            size='icon'
            onClick={() => togglePassword('password')}>
            {showPassword.password ? (
              <EyeOff className='stroke-1 h-5 w-5' />
            ) : (
              <Eye className='stroke-1 h-5 w-5' />
            )}
          </Button>
        </div>
        {form.formState.errors.password ? (
          <span className='text-xs text-red-500'>
            {form.formState.errors.password.message}
          </span>
        ) : null}
        <div className='flex gap-1'>
          <Input
            type={showPassword.confirmPassword ? 'text' : 'password'}
            placeholder='Confirm Password'
            error={form.formState.errors.confirmPassword}
            {...form.register('confirmPassword')}
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
        {form.formState.errors.confirmPassword ? (
          <span className='text-xs text-red-500'>
            {form.formState.errors.confirmPassword.message}
          </span>
        ) : null}
      </div>
      <div>
        <Button
          disabled={isLoading}
          className='w-full'
          onClick={form.handleSubmit(submit)}>
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            'Update Password'
          )}
        </Button>
      </div>
    </div>
  );
}
