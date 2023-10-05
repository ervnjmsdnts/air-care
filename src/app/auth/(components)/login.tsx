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
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { LoginSchema, loginSchema } from '@/trpc/schema';

export default function Login({ action }: { action: () => void }) {
  const form = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: createAudit } = trpc.createAudit.useMutation();
  const { mutate: login, isLoading } = trpc.login.useMutation({
    onSuccess: (data) => {
      createAudit({
        label: `User ${data.name} has logged in`,
        userId: data.id,
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
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

  return (
    <Card className='w-[400px]'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Welcome Back!</CardTitle>
        <CardDescription>Please enter your details</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
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
          <Input
            id='password'
            type='password'
            {...form.register('password')}
            error={form.formState.errors.password}
          />
        </div>
        <Button disabled={isLoading} onClick={form.handleSubmit(submit)}>
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Login'}
        </Button>
        <span className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Button variant='link' className='p-0' onClick={action}>
            Sign up!
          </Button>
        </span>
      </CardContent>
    </Card>
  );
}
