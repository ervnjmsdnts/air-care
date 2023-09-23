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

export default function SignUp({ action }: { action: () => void }) {
  return (
    <Card className='w-[400px]'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Create an Account</CardTitle>
        <CardDescription>Please enter your details</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <div className='grid gap-2'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='phoneNumber'>Phone Number</Label>
          <Input id='phoneNumber' />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='address'>Address</Label>
          <Input id='address' />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email Address</Label>
          <Input id='email' type='email' placeholder='m@example.com' />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' type='password' />
        </div>
        <Button>Create account</Button>
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
