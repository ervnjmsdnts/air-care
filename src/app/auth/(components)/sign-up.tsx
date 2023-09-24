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
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const SignupSchema = z.object({
  name: z.string(),
  phone_number: z.string(),
  address: z.string(),
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z.string().min(6, { message: 'Must be at least 6 characters' }),
});

type SignupType = z.infer<typeof SignupSchema>;

export default function SignUp({ action }: { action: () => void }) {
  const form = useForm<SignupType>({ resolver: zodResolver(SignupSchema) });
  const { toast } = useToast();
  const router = useRouter();

  async function submit(data: SignupType) {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        role: 'user',
      }),
    });

    const userInfo = await response.json();

    if (userInfo.error) {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: userInfo.error,
      });
    }

    toast({
      title: 'Perfect! No issues or problems occurred.',
      description: 'Account created',
    });

    action();
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
          <Input id='name' {...form.register('name')} />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='phoneNumber'>Phone Number</Label>
          <Input id='phoneNumber' {...form.register('phone_number')} />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='address'>Address</Label>
          <Input id='address' {...form.register('address')} />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email Address</Label>
          <Input
            id='email'
            type='email'
            placeholder='m@example.com'
            {...form.register('email')}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' type='password' {...form.register('password')} />
        </div>
        <Button onClick={form.handleSubmit(submit)}>Create account</Button>
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
