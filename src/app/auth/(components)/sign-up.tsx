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
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { trpc } from '@/app/_trpc/client';
import { CreateUserSchema, createUserSchema } from '@/trpc/schema';

export default function SignUp({ action }: { action: () => void }) {
  const {
    formState: { errors },
    ...form
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });
  const { toast } = useToast();

  const { mutate: createAudit } = trpc.createAudit.useMutation();
  const { mutate: signUp, isLoading } = trpc.signUp.useMutation({
    onSuccess: (data) => {
      createAudit({
        label: `User ${data.name} has been created`,
        userId: data.id,
      });
      toast({
        title: 'Perfect! No issues or problems occurred.',
        description: 'Account created',
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
      <CardContent className='flex flex-col gap-2'>
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
            <Input
              id='password'
              error={errors.password}
              type='password'
              {...form.register('password')}
            />
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
            <Input
              id='confirm-password'
              error={errors.confirmPassword}
              type='password'
              {...form.register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <span className='text-xs text-red-500'>
                {errors.confirmPassword.message}
              </span>
            ) : null}
          </div>
        </div>
        <Button disabled={isLoading} onClick={form.handleSubmit(submit)}>
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            'Create Account'
          )}
        </Button>
        <span className='text-center text-sm'>
          Already have an account?{' '}
          <Button variant='link' className='p-0' onClick={action}>
            Log in!
          </Button>
        </span>
      </CardContent>
    </Card>
  );
}
