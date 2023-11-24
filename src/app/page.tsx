'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  CalendarCheck,
  Check,
  Cog,
  Facebook,
  Hammer,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useRef } from 'react';

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

const pricings = {
  CLEANING: [
    'Standard check up',
    'Pressurized cleaning of indoor and outdoor unit',
    'Flushing of drain pipes',
    'Cleaning of filters and external parts',
  ],
  REPAIR: [
    'Check power supply issues, dirty filters, refrigerant leaks',
    'Basic repairs or seek specialized repair services',
    'Examine Condenser Unit',
  ],
  INSTALLATION: [
    'Split system air conditioner unit',
    'Insulated copper tubing',
    'Dismantling of Unit',
  ],
};

const PricingItem = ({ content }: { content: string }) => {
  return (
    <div className='flex gap-2'>
      <Check className='flex-shrink-0' />
      <span>{content}</span>
    </div>
  );
};

export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);
  const serviceRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToService = () => {
    serviceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className='bg-[#1da9c1]'>
        <div className='sm:p-2 max-w-6xl mx-auto'>
          <div className='flex items-center justify-center sm:justify-between'>
            <Logo className='text-8xl p-0 text-white' />
            <div className='hidden sm:flex items-center gap-8'>
              <div className='flex items-center gap-2 text-white'>
                <Phone className='stroke-1' />
                <p>+63 998 576 3538</p>
              </div>
              <div className='flex items-center gap-2 text-white'>
                <MapPin className='stroke-1' />
                <p>Gulod Labac, Batangas City, Philippines, 4200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='sm:max-w-7xl mx-auto sticky top-0 z-30'>
        <div className='sm:bg-primary absolute sm:max-w-7xl h-[100px] rounded-b-lg w-full'></div>
        <nav className='bg-white absolute p-4 rounded-b-lg sm:max-w-7xl w-full'>
          <div className='flex items-center justify-between max-w-6xl mx-auto'>
            <div className='hidden sm:flex items-center gap-3'>
              <Button
                variant='link'
                onClick={scrollToAbout}
                className='text-md uppercase font-semibold'>
                About Us
              </Button>
              <Button
                variant='link'
                onClick={scrollToService}
                className='text-md uppercase font-semibold'>
                Services
              </Button>
              <Button
                variant='link'
                onClick={scrollToGallery}
                className='text-md uppercase font-semibold'>
                Gallery
              </Button>
              <Button
                variant='link'
                onClick={scrollToPricing}
                className='text-md uppercase font-semibold'>
                Pricing
              </Button>
            </div>
            <Sheet>
              <SheetTrigger className='sm:hidden' asChild>
                <Button variant='outline' size='icon'>
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side='left'>
                <div className='flex flex-col gap-2'>
                  <Button
                    variant='link'
                    onClick={scrollToAbout}
                    className='text-md uppercase font-semibold'>
                    About Us
                  </Button>
                  <Button
                    variant='link'
                    onClick={scrollToService}
                    className='text-md uppercase font-semibold'>
                    Services
                  </Button>
                  <Button
                    variant='link'
                    onClick={scrollToGallery}
                    className='text-md uppercase font-semibold'>
                    Gallery
                  </Button>
                  <Button
                    variant='link'
                    onClick={scrollToPricing}
                    className='text-md uppercase font-semibold'>
                    Pricing
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <Button
                asChild
                className='uppercase sm:text-lg sm:tracking-wide sm:py-8 font-medium'
                size='lg'>
                <Link href='/auth'>Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>
      <section className="bg-[url('/images/landing.jpeg')] h-[800px] bg-no-repeat bg-cover bg-center relative">
        <div className='bg-black opacity-75 z-10 absolute w-full h-full'></div>
        <div className='relative z-20 text-white flex-col flex items-center justify-center h-full'>
          <h1 className='text-xl sm:text-8xl font-semibold'>
            MCCD Air Care Services
          </h1>
          <p className='text-center'>
            The ultimate one-stop shop for all your air conditioning needs.
          </p>
          <Button size='lg' asChild className='mt-8 sm:text-lg'>
            <Link href='/auth'>Get Started</Link>
          </Button>
        </div>
      </section>
      <section
        ref={serviceRef}
        className='sm:max-w-6xl sm:mx-auto px-2 sm:px-0 py-8'>
        <div className='grid gap-8 grid-cols-1 sm:grid-cols-4'>
          <div className='border hover:border-primary p-4 grid gap-6'>
            <div className='bg-zinc-300 w-28 h-28 grid place-items-center rounded-full'>
              <Hammer className='w-16 h-16 stroke-1 stroke-primary' />
            </div>
            <h3 className='text-2xl text-primary font-semibold uppercase'>
              Repair
            </h3>
            <p className='text-lg text-primary'>
              From strange noises to uneven cooling, our experts are trained to
              diagnose and fix a wide range of issues. We believe in transparent
              and upfront communication, so you&apos;ll know exactly what needs
              fixing and why.
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
              Our installations are not just about putting in a unit;
              they&apos;re about creating an atmosphere of comfort. We take
              pride in our precision and attention to detail, ensuring that your
              new air conditioner runs efficiently from day one.
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
              With just a call or a few clicks on our user-friendly website, you
              can book an appointment that suits you. Our online scheduling
              system lets you choose the date and time that works best for your
              needs.
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
              When it comes to your comfort, emergencies can happen at any time.
              That&apos;s why at MCCD air care, we&apos;re proud to offer
              around-the-clock, 24/7 support to keep you cool and worry-free.
            </p>
          </div>
        </div>
      </section>
      <section className='sm:mx-auto sm:max-w-6xl pt-32'>
        <div className='mb-16'>
          <h1 className='text-primary text-2xl sm:text-4xl font-semibold mb-4 text-center'>
            All Brands Services
          </h1>
          <Separator className='w-64 mx-auto' />
        </div>
        <div className='grid px-2 sm:px-0 sm:grid-cols-5 grid-cols-2 sm:grid-rows-2 place-items-center gap-8 sm:gap-16'>
          <div className='relative w-full h-16'>
            <Image src='/images/brands/carrier.png' fill alt='Carrier' />
          </div>
          <div className='relative w-full h-8'>
            <Image src='/images/brands/samsung.png' fill alt='Carrier' />
          </div>
          <div className='relative w-full h-24'>
            <Image src='/images/brands/lg.png' fill alt='Carrier' />
          </div>
          <div className='relative w-full h-24'>
            <Image src='/images/brands/panasonic.png' fill alt='Carrier' />
          </div>
          <div className='relative w-full h-16'>
            <Image src='/images/brands/fuji.jpg' fill alt='Carrier' />
          </div>
          <div className='relative w-full h-16'>
            <Image src='/images/brands/kolin.png' fill alt='Carrier' />
          </div>
          <div className='relative w-full h-32'>
            <Image src='/images/brands/koppel.png' fill alt='Carrier' />
          </div>
          <div className='relative w-full h-32'>
            <Image src='/images/brands/daikin.png' fill alt='Carrier' />
          </div>
          <div className='relative w-full h-32'>
            <Image src='/images/brands/condura.jpg' fill alt='Carrier' />
          </div>
          <div className='relative w-full h-32'>
            <Image src='/images/brands/sharp.png' fill alt='Carrier' />
          </div>
        </div>
      </section>
      <section ref={pricingRef} className='sm:mx-auto sm:max-w-6xl pt-32'>
        <div className='mb-16'>
          <h1 className='text-primary text-2xl sm:text-4xl font-semibold mb-4 text-center'>
            Pricing
          </h1>
          <Separator className='w-64 mx-auto' />
        </div>
        <div className='grid sm:grid-cols-3 gap-4'>
          <div className='bg-secondary h-full rounded-md px-8 py-16'>
            <div className='text-center flex flex-col gap-3 pb-8'>
              <p className='text-primary uppercase font-semibold'>Cleaning</p>
              <p className='text-primary uppercase font-semibold'>Starts At</p>
              <h3 className='text-4xl font-semibold'>&#x20B1;600</h3>
              <p className='text-primary uppercase font-light tracking-widest'>
                Varies on Type
              </p>
            </div>
            <div className='flex flex-col gap-2 pb-8'>
              {pricings.CLEANING.map((content, index) => (
                <PricingItem content={content} key={index} />
              ))}
            </div>
            <Link href='/auth'>
              <p className='w-full rounded-full p-4 text-white bg-primary text-center'>
                Book Now
              </p>
            </Link>
          </div>
          <div className='bg-primary h-full rounded-md px-8 py-16 text-white'>
            <div className='text-center flex flex-col gap-3 pb-8'>
              <p className='uppercase font-semibold'>Installation</p>
              <p className='uppercase font-semibold'>Starts At</p>
              <h3 className='text-4xl font-semibold'>&#x20B1;750</h3>
              <p className='uppercase font-light tracking-widest'>
                Varies on Type
              </p>
            </div>
            <div className='flex flex-col gap-2 pb-8'>
              {pricings.INSTALLATION.map((content, index) => (
                <PricingItem content={content} key={index} />
              ))}
            </div>

            <Link href='/auth'>
              <p className='w-full rounded-full p-4 text-primary bg-secondary text-center'>
                Book Now
              </p>
            </Link>
          </div>
          <div className='bg-secondary h-full rounded-md px-8 py-16'>
            <div className='text-center flex flex-col gap-3 pb-8'>
              <p className='text-primary uppercase font-semibold'>Repair</p>
              <p className='uppercase font-semibold'>Starts At</p>
              <h3 className='text-4xl font-semibold'>&#x20B1;500</h3>
              <p className='text-primary uppercase font-light tracking-widest'>
                Varies on Type
              </p>
            </div>
            <div className='flex flex-col gap-2 pb-8'>
              {pricings.REPAIR.map((content, index) => (
                <PricingItem content={content} key={index} />
              ))}
            </div>

            <Link href='/auth'>
              <p className='w-full rounded-full p-4 text-white bg-primary text-center'>
                Book Now
              </p>
            </Link>
          </div>
        </div>
      </section>
      <section ref={galleryRef} className='mx-auto max-w-6xl pt-32 pb-40'>
        <div className='mb-16'>
          <h1 className='text-primary text-2xl sm:text-4xl font-semibold mb-4 text-center'>
            Our Featured Works
          </h1>
          <Separator className='w-64 mx-auto' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 grid-rows-[repeat(9,_200px)] sm:grid-rows-[repeat(3,_300px)] gap-4'>
          <div className='relative'>
            <Image
              fill
              src='/images/gallery/1.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative'>
            <Image
              fill
              src='/images/gallery/2.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative'>
            <Image
              fill
              src='/images/gallery/3.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative'>
            <Image
              fill
              src='/images/gallery/4.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative'>
            <Image
              fill
              src='/images/gallery/5.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative '>
            <Image
              fill
              src='/images/gallery/6.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative '>
            <Image
              fill
              src='/images/gallery/7.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative '>
            <Image
              fill
              src='/images/gallery/8.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
          <div className='relative '>
            <Image
              fill
              src='/images/gallery/9.jpg'
              className='rounded-lg'
              alt='1'
            />
          </div>
        </div>
      </section>

      <div className='bg-zinc-50'>
        <section className='mx-auto sm:max-w-6xl px-2 sm:px-0 py-24'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31002.69891377523!2d121.04922972354258!3d13.758517629246558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd054ef2dc56b7%3A0xf529972aec981ff9!2sMccd%20Aircare%20Trading!5e0!3m2!1sen!2sph!4v1700634873803!5m2!1sen!2sph'
            className='w-full h-80'
            style={{ border: '0' }}
            loading='lazy'></iframe>
        </section>
      </div>
      <footer
        ref={aboutRef}
        className='bg-primary text-primary-foreground py-8 sm:px-64 px-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='grid gap-8 sm:grid-cols-3 grid-rows-[1fr_100px]'>
            <div className='flex flex-col gap-6'>
              <h3 className='text-xl uppercase tracking-tight font-semibold'>
                About Company
              </h3>
              <p className='text-muted-foreground font-medium'>
                At MCCD Air Care Airconditioning Services, we pride ourselves on
                delivering top-notch air conditioning services. From
                installation to maintenance, we&apos;ve got the expertise to
                keep your home or office cool and refreshing.
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
            <div className='flex flex-col gap-6'>
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
              <a
                href='https://www.facebook.com/AirCare16'
                target='_blank'
                className='w-10 h-10 cursor-pointer bg-white/20 grid place-items-center rounded-full'>
                <Facebook className='stroke-1 text-white/50' />
              </a>
              <div className='w-10 h-10 bg-white/20 grid place-items-center rounded-full'>
                <Instagram className='stroke-1 text-white/50' />
              </div>
              <div className='w-10 h-10 bg-white/20 grid place-items-center rounded-full'>
                <Twitter className='stroke-1 text-white/50' />
              </div>
            </div>
            <div className='flex flex-col gap-6'>
              <h3 className='text-xl uppercase tracking-tight font-semibold'>
                Contact Us
              </h3>
              <div className='grid gap-2'>
                <p className='text-muted-foreground font-medium'>
                  Cell: +63 998 576 3538
                </p>
                <p className='text-muted-foreground font-medium'>
                  Email: aircare116@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
