'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { LoginSchema, loginSchema } from '@/trpc/schema';
import { useState } from 'react';
import { ToastAction } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export default function Login({ action }: { action: () => void }) {
  const form = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const { mutate: createAudit } = trpc.createAudit.useMutation();
  const { mutate: sendVerificationEmail } =
    trpc.sendVerificationEmail.useMutation();
  const { mutate: login, isLoading } = trpc.login.useMutation({
    onSuccess: (data) => {
      createAudit({
        label: `User ${data.name} has logged in`,
        userId: data.id,
      });
      window.location.reload();
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        const email = form.getValues('email');
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Somthing went wrong',
          description: error.message,
          action: (
            <ToastAction
              onClick={() => sendVerificationEmail({ email })}
              altText='Send verification email'>
              Send Email
            </ToastAction>
          ),
        });
      }
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Somthing went wrong',
        description: error.message,
      });
    },
  });

  async function submit(formData: LoginSchema) {
    const { email, password } = formData;
    login({ email, password });
  }

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <Card className='w-[400px]'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Welcome Back!</CardTitle>
        <CardDescription>Please enter your details</CardDescription>
      </CardHeader>
      <CardContent className='w-full'>
        <form
          onSubmit={form.handleSubmit(submit)}
          className='flex flex-col gap-2'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              error={form.formState.errors.email}
              {...form.register('email')}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='flex gap-1'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                {...form.register('password')}
                error={form.formState.errors.password}
              />
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={togglePassword}>
                {showPassword ? (
                  <EyeOff className='w-5 h-5 stroke-1' />
                ) : (
                  <Eye className='w-5 h-5 stroke-1' />
                )}
              </Button>
            </div>
          </div>
          <Button disabled={isLoading}>
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Login'}
          </Button>
          <Button
            onClick={() => router.push('/forgot-password')}
            variant='link'
            type='button'
            className='self-start p-0'>
            Forgot password
          </Button>
          <span className='text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Button
              variant='link'
              type='button'
              className='p-0'
              onClick={action}>
              Sign up!
            </Button>
          </span>
        </form>
      </CardContent>
    </Card>
  );
}
