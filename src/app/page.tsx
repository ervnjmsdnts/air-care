import { Button } from '@/components/ui/button';
import Image from 'next/image';
import tilt from '../../public/images/tilt-top.svg';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, Instagram, Mail, MapPin, Smartphone } from 'lucide-react';
import Link from 'next/link';

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
    Icon: Smartphone,
    label: '+63 998 576 3538',
  },
  {
    Icon: Mail,
    label: 'aircare116@gmail.com',
  },
  {
    Icon: MapPin,
    label: 'Gulod Labac, Batangas City, Philippines, 4200',
  },
];

export default function Home() {
  return (
    <div className='flex flex-col gap-10'>
      <section className='flex flex-col sm:flex-row items-center mt-8 sm:mt-0 justify-between sm:px-64'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-8 items-center sm:items-start'>
            <div className='text-center sm:text-left'>
              <h1 className='text-primary font-bold text-6xl'>
                Air Care Services
              </h1>
              <p className='text-muted-foreground text-2xl sm:w-96'>
                The ultimate one-stop shop for all your air conditioning needs.
              </p>
            </div>
            <Button className='px-10' asChild>
              <Link href='/auth'>Inquire Now</Link>
            </Button>
          </div>
        </div>
        <Image
          src='/images/main.jpg'
          alt='main'
          width={600}
          height={600}
          className='w-[625px] hidden sm:block'
        />
      </section>
      <section className='sm:px-64 px-4 py-4'>
        <h2 className='text-muted-foreground text-center text-2xl pb-8 font-bold'>
          Our Services
        </h2>
        <div className='grid grid-cols-4 justify-evenly'>
          {services.map((service) => (
            <div
              className='flex flex-col items-center gap-2'
              key={service.name}>
              <Image
                src={service.image}
                width={300}
                height={300}
                alt={service.name}
                className=''
              />
              <h3 className='text-primary font-bold text-lg'>{service.name}</h3>
            </div>
          ))}
        </div>
      </section>
      <section className='relative py-4 sm:block hidden'>
        <div className='aboslute -mt-12'>
          <Image
            src={tilt}
            priority
            alt='tilt'
            className='w-full h-[200px] bg-muted text-primary'
          />
          <div className='bg-muted w-full h-80 px-64 flex justify-end items-center text-muted-foreground'>
            <div className='flex flex-col gap-6 justify-center items-end'>
              <div className='text-3xl font-bold text-right'>
                <h3>Get the best airconditioning services from us,</h3>
                <h3>Just for you!</h3>
              </div>
              <Button className='px-10' asChild>
                <Link href='/auth'>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className='sm:px-64 px-8 py-4'>
        <h2 className='text-muted-foreground text-center text-2xl pb-8 font-bold'>
          Gallery
        </h2>
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
      <section className='sm:px-64 px-8 py-4'>
        <h2 className='text-muted-foreground text-center text-2xl pb-8 font-bold'>
          Contact Us
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2'>
          <div className='flex flex-col gap-8'>
            {contactInfo.map((contact) => (
              <div
                className='flex flex-col sm:flex-row items-center gap-2'
                key={contact.label}>
                <contact.Icon />
                <p className='font-bold'>{contact.label}</p>
              </div>
            ))}
          </div>
          <div className='sm:px-16 mt-8 sm:mt-0 flex flex-col gap-4'>
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
            <Button className='self-end px-10'>Send</Button>
          </div>
        </div>
      </section>
      <footer className='bg-primary text-primary-foreground py-8 sm:px-64 px-8'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-1'>
            <h3 className='font-bold text-3xl'>Air Care</h3>
            <div className='flex items-center gap-4'>
              <Button className='rounded-full p-0 text-primary-foreground'>
                <Facebook />
              </Button>
              <Button className='rounded-full p-0 text-primary-foreground'>
                <Instagram />
              </Button>
            </div>
          </div>
          <p>Copyright &copy; 2023 AirCare</p>
        </div>
      </footer>
    </div>
  );
}
