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
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { addAudit } from '@/utils/audit';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z.string().min(6, { message: 'Must be at least 6 characters' }),
});

type LoginType = z.infer<typeof LoginSchema>;

export default function Login({ action }: { action: () => void }) {
  const form = useForm<LoginType>({ resolver: zodResolver(LoginSchema) });
  const { toast } = useToast();
  const router = useRouter();

  async function submit(formData: LoginType) {
    const { email, password } = formData;
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const userInfo = await response.json();

    if (userInfo.error) {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong',
        description: userInfo.error,
      });
    }

    await addAudit({
      label: `User ${userInfo.data.name} has logged in`,
      userId: userInfo.data.id,
    });

    router.refresh();
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
        <Button onClick={form.handleSubmit(submit)}>Login</Button>
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
