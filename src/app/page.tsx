import { Button } from '@/components/ui/button';
import Image from 'next/image';
import tilt from '../../public/images/tilt-top.svg';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight,
  CalendarCheck,
  Cog,
  Facebook,
  Hammer,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { Separator } from '@/components/ui/separator';

const services = [
  {
    name: 'Installation',
    image: '/images/installation.jpg',
  },
  {
    name: 'Repair',
    image: '/images/repair.jpg',
  },
  {
    name: 'Scheduling',
    image: '/images/schedule.jpg',
  },
  {
    name: '24/7 Support',
    image: '/images/support.jpg',
  },
];

const contactInfo = [
  {
    Icon: MapPin,
    label: 'Gulod Labac, Batangas City, Philippines, 4200',
  },
  {
    Icon: Phone,
    label: '+63 998 576 3538',
  },
  {
    Icon: Mail,
    label: 'aircare116@gmail.com',
  },
];

export default function Home() {
  return (
    <div>
      <div className='bg-white p-2 border-b max-w-6xl mx-auto'>
        <div className='flex items-center justify-between'>
          <Logo className='text-8xl p-0' />
          <div className='flex items-center gap-8'>
            <div className='flex items-center gap-2 text-primary'>
              <Phone className='stroke-1' />
              <p>+63 998 576 3538</p>
            </div>
            <div className='flex items-center gap-2 text-primary'>
              <MapPin className='stroke-1' />
              <p>Gulod Labac, Batangas City, Philippines, 4200</p>
            </div>
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto sticky top-0 z-30'>
        <div className='bg-primary absolute max-w-7xl h-[100px] rounded-b-lg w-full'></div>
        <nav className='bg-white absolute p-4 rounded-b-lg max-w-7xl w-full'>
          <div className='flex items-center justify-between max-w-6xl mx-auto'>
            <div className='flex items-center gap-3'>
              <Button
                variant='link'
                className='text-md uppercase font-semibold'>
                About Us
              </Button>
              <Button
                variant='link'
                className='text-md uppercase font-semibold'>
                Services
              </Button>
              <Button
                variant='link'
                className='text-md uppercase font-semibold'>
                Gallery
              </Button>
            </div>
            <div>
              <Button
                asChild
                className='uppercase text-lg tracking-wide py-8 font-medium'
                size='lg'>
                <Link href='/auth'>Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>
      <section className="bg-[url('/images/gallery/4.jpeg')] h-[800px] bg-no-repeat bg-cover bg-center relative">
        <div className='bg-black opacity-75 z-10 absolute w-full h-full'></div>
        <div className='relative z-20 text-white flex-col flex items-center justify-center h-full'>
          <h1 className='text-8xl font-semibold'>MCCD Air Care Services</h1>
          <p className='text-2xl'>
            The ultimate one-stop shop for all your air conditioning needs.
          </p>
          <Button size='lg' asChild className='mt-8 text-lg'>
            <Link href='/auth'>Get Started</Link>
          </Button>
        </div>
      </section>
      <section className='max-w-6xl mx-auto py-8'>
        <div className='grid gap-8 grid-cols-4'>
          <div className='border hover:border-primary p-4 grid gap-6'>
            <div className='bg-zinc-300 w-28 h-28 grid place-items-center rounded-full'>
              <Hammer className='w-16 h-16 stroke-1 stroke-primary' />
            </div>
            <h3 className='text-2xl text-primary font-semibold uppercase'>
              Repair
            </h3>
            <p className='text-lg text-primary'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque,
              rerum.
            </p>
          </div>
          <div className='border hover:border-primary p-4 grid gap-6'>
            <div className='bg-zinc-300 w-28 h-28 grid place-items-center rounded-full'>
              <Cog className='w-16 h-16 stroke-1 stroke-primary' />
            </div>
            <h3 className='text-2xl text-primary font-semibold uppercase'>
              Installation
            </h3>
            <p className='text-lg text-primary'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque,
              rerum.
            </p>
          </div>
          <div className='border hover:border-primary p-4 grid gap-6'>
            <div className='bg-zinc-300 w-28 h-28 grid place-items-center rounded-full'>
              <CalendarCheck className='w-16 h-16 stroke-1 stroke-primary' />
            </div>
            <h3 className='text-2xl text-primary font-semibold uppercase'>
              Scheduling
            </h3>
            <p className='text-lg text-primary'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque,
              rerum.
            </p>
          </div>
          <div className='border hover:border-primary p-4 grid gap-6'>
            <div className='bg-zinc-300 w-28 h-28 grid place-items-center rounded-full'>
              <ShieldCheck className='w-16 h-16 stroke-1 stroke-primary' />
            </div>
            <h3 className='text-2xl text-primary font-semibold uppercase'>
              24/7 Support
            </h3>
            <p className='text-lg text-primary'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque,
              rerum.
            </p>
          </div>
        </div>
      </section>
      <section className='mx-auto max-w-6xl pt-32 pb-40'>
        <div className='mb-16'>
          <h1 className='text-primary text-4xl font-semibold mb-4 text-center'>
            Our Featured Works
          </h1>
          <Separator className='w-64 mx-auto' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-gallery auto-rows-[10px] gap-4'>
          <div className='relative row-[span_12]'>
            <Image
              fill
              src='/images/gallery/1.jpeg'
              className='rounded-lg object-cover'
              alt='1'
            />
          </div>
          <div className='relative row-[span_10]'>
            <Image
              fill
              src='/images/gallery/2.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative row-[span_8]'>
            <Image
              fill
              src='/images/gallery/3.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative row-[span_12]'>
            <Image
              fill
              src='/images/gallery/4.jpeg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative row-[span_12]'>
            <Image
              fill
              src='/images/gallery/5.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative row-[span_12]'>
            <Image
              fill
              src='/images/gallery/6.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative row-[span_12]'>
            <Image
              fill
              src='/images/gallery/7.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative row-[span_12]'>
            <Image
              fill
              src='/images/gallery/8.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
        </div>
      </section>

      <div className='bg-zinc-50'>
        <section className='mx-auto max-w-6xl py-24'>
          <div className='mb-16'>
            <h1 className='text-primary text-4xl font-semibold mb-4 text-center'>
              Get in Touch
            </h1>
            <Separator className='w-64 bg-zinc-300 mx-auto' />
          </div>
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
            <div className='bg-white py-16 border rounded-lg'>
              <div className='sm:px-16 text-primary mt-8 sm:mt-0 flex flex-col gap-4'>
                <h2 className='text-2xl uppercase tracking-tight font-semibold'>
                  Contact Us
                </h2>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Accusamus, fugiat!
                </p>
                <div className='grid gap-2'>
                  <Label htmlFor='fullName'>Full Name</Label>
                  <Input id='fullName' />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input id='email' type='email' placeholder='m@example.com' />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='message'>Message</Label>
                  <Textarea id='message' />
                </div>
                <Button className='text-lg uppercase'>Send</Button>
              </div>
            </div>
            <div className='text-primary flex flex-col gap-4'>
              <h2 className='text-2xl uppercase tracking-tight font-semibold'>
                Our Office Address
              </h2>
              {contactInfo.map((contact) => (
                <div
                  className='flex flex-col sm:flex-row items-center gap-2'
                  key={contact.label}>
                  <contact.Icon className='stroke-1' />
                  <p className=''>{contact.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <footer className='bg-primary text-primary-foreground py-8 sm:px-64 px-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='grid gap-8 grid-cols-3 grid-rows-2'>
            <div className='flex flex-col gap-6'>
              <h3 className='text-xl uppercase tracking-tight font-semibold'>
                About Company
              </h3>
              <p className='text-muted-foreground font-medium'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                reprehenderit delectus eum consequatur esse. Nisi.
              </p>
            </div>
            <div className='flex flex-col gap-6'>
              <h3 className='text-xl uppercase tracking-tight font-semibold'>
                Office
              </h3>
              <p className='text-muted-foreground font-medium'>
                Gulod Labac, Batangas City, Philippines, 4200
              </p>
            </div>
            <div className='row-span-2 flex flex-col gap-6'>
              <h3 className='text-xl uppercase tracking-tight font-semibold'>
                Quick Links
              </h3>
              <div className='flex flex-col items-start gap-4'>
                <Link
                  href='/'
                  className='hover:text-white text-muted-foreground font-medium'>
                  About Us
                </Link>
                <Link
                  href='/'
                  className='hover:text-white text-muted-foreground font-medium'>
                  Services
                </Link>
                <Link
                  href='/'
                  className='hover:text-white text-muted-foreground font-medium'>
                  Gallery
                </Link>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='w-10 h-10 bg-white/20 grid place-items-center rounded-full'>
                <Facebook className='stroke-1 text-white/50' />
              </div>
              <div className='w-10 h-10 bg-white/20 grid place-items-center rounded-full'>
                <Instagram className='stroke-1 text-white/50' />
              </div>
              <div className='w-10 h-10 bg-white/20 grid place-items-center rounded-full'>
                <Twitter className='stroke-1 text-white/50' />
              </div>
            </div>
            <div className='flex flex-col gap-6'>
              <h3 className='text-xl uppercase tracking-tight font-semibold'>
                Call Us
              </h3>
              <p className='text-muted-foreground font-medium'>
                Cell: +63 998 576 3538
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
