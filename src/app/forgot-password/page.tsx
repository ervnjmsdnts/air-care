'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../_trpc/client';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  email: z.string().min(1, 'Field is required').email('Enter valid email'),
});

type Schema = z.infer<typeof schema>;

export default function ForgotPassword() {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const { toast } = useToast();

  const { mutate: forgotPassword, isLoading } = trpc.forgotPassword.useMutation(
    {
      onSuccess: () =>
        toast({
          title: 'Forgot Password',
          description: 'An email has been sent to you',
        }),
      onError: () =>
        toast({
          title: 'Forgot Password',
          variant: 'destructive',
          description: 'Something went wrong',
        }),
    },
  );

  const submit = (data: Schema) => {
    forgotPassword({ email: data.email });
  };

  return (
    <div className='h-full'>
      <div className='flex flex-col items-center justify-center h-full  p-4 space-y-4 antialiased text-gray-900 bg-gray-100'>
        <div className='w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16'>
          <h1 className=' mb-6 text-3xl font-bold text-center'>
            Don&apos;t worry
          </h1>
          <p className='text-center mx-12'>
            We are here to help you to recover your password. Enter the email
            address you used when you joined and we&apos;ll send you
            instructions to reset your password.
          </p>
          <div className='space-y-6 w-ful'>
            <Input
              error={form.formState.errors.email}
              type='email'
              placeholder='Email address'
              {...form.register('email')}
            />
            <div>
              <Button
                className='w-full'
                disabled={isLoading}
                onClick={form.handleSubmit(submit)}>
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  'Send'
                )}
              </Button>
            </div>
          </div>
          <div className='text-sm text-gray-600 items-center flex justify-between'>
            <Link
              href='/auth'
              className='text-gray-800 cursor-pointer inline-flex items-center ml-4'>
              <ArrowLeft className='h-4 w-4 mr-3' />
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
