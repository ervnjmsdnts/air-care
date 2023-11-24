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
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { trpc } from '@/app/_trpc/client';
import { CreateUserSchema, createUserSchema } from '@/trpc/schema';
import { useState } from 'react';

export default function SignUp({ action }: { action: () => void }) {
  const {
    formState: { errors },
    ...form
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const { mutate: createAudit } = trpc.createAudit.useMutation();
  const { mutate: signUp, isLoading } = trpc.signUp.useMutation({
    onSuccess: (data) => {
      createAudit({
        label: `User ${data.name} has been created`,
        userId: data.id,
      });
      toast({
        title: 'Perfect! No issues or problems occurred.',
        description:
          'A verification email has been sent to your email address.',
      });

      action();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
      });
    },
  });

  async function submit(data: CreateUserSchema) {
    signUp({ ...data });
  }

  return (
    <Card className='w-[400px]'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Create an Account</CardTitle>
        <CardDescription>Please enter your details</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(submit)}
          className='flex flex-col gap-2'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <div>
              <Input id='name' {...form.register('name')} error={errors.name} />
              {errors.name ? (
                <span className='text-xs text-red-500'>
                  {errors.name.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='phoneNumber'>Phone Number</Label>
            <div>
              <Input
                id='phoneNumber'
                {...form.register('phoneNumber')}
                error={errors.phoneNumber}
              />
              {errors.phoneNumber ? (
                <span className='text-xs text-red-500'>
                  {errors.phoneNumber.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='address'>Address</Label>
            <div>
              <Input
                id='address'
                {...form.register('address')}
                error={errors.address}
              />
              {errors.address ? (
                <span className='text-xs text-red-500'>
                  {errors.address.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email Address</Label>
            <div>
              <Input
                error={errors.email}
                id='email'
                type='email'
                placeholder='m@example.com'
                {...form.register('email')}
              />
              {errors.email ? (
                <span className='text-xs text-red-500'>
                  {errors.email.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <div>
              <div className='flex gap-1'>
                <Input
                  id='password'
                  error={errors.password}
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')}
                />
                <Button variant='outline' size='icon' onClick={togglePassword}>
                  {showPassword ? (
                    <EyeOff className='w-5 h-5 stroke-1' />
                  ) : (
                    <Eye className='w-5 h-5 stroke-1' />
                  )}
                </Button>
              </div>
              {errors.password ? (
                <span className='text-xs text-red-500'>
                  {errors.password.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='confirm-password'>Confirm Password</Label>
            <div>
              <div className='flex gap-1'>
                <Input
                  id='confirm-password'
                  error={errors.confirmPassword}
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...form.register('confirmPassword')}
                />
                <Button
                  variant='outline'
                  size='icon'
                  onClick={toggleConfirmPassword}>
                  {showConfirmPassword ? (
                    <EyeOff className='w-5 h-5 stroke-1' />
                  ) : (
                    <Eye className='w-5 h-5 stroke-1' />
                  )}
                </Button>
              </div>
              {errors.confirmPassword ? (
                <span className='text-xs text-red-500'>
                  {errors.confirmPassword.message}
                </span>
              ) : null}
            </div>
          </div>
          <Button disabled={isLoading}>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'Create Account'
            )}
          </Button>
          <span className='text-center text-sm'>
            Already have an account?{' '}
            <Button
              variant='link'
              type='button'
              className='p-0'
              onClick={action}>
              Log in!
            </Button>
          </span>
        </form>
      </CardContent>
    </Card>
  );
}
