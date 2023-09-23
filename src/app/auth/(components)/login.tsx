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

export default function Login({ action }: { action: () => void }) {
  return (
    <Card className='w-[400px]'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Welcome Back!</CardTitle>
        <CardDescription>Please enter your details</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email Address</Label>
          <Input id='email' type='email' placeholder='m@example.com' />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' type='password' />
        </div>
        <Button>Login</Button>
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
