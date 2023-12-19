import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.VERCEL_URL
  ? `https://mccd-air-care.vercel.app`
  : 'http://localhost:3000';

export default function ForgotPasswordEmail({ userId }: { userId: string }) {
  const previewText = 'Forgot Password';

  const verifyLink = `${baseUrl}/reset-password/${userId}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans'>
          <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]'>
            <Section className='mt-[32px]'>
              <Text className='text-center text-[#1da9c1] font-bold text-xl'>
                Air Care
              </Text>
            </Section>
            <Heading className='text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0'>
              <strong>{previewText}</strong>
            </Heading>
            <Section className='text-center mt-[32px] mb-[32px]'>
              <Button
                className='bg-[#1da9c1] px-8 py-2 rounded text-white text-[12px] font-semibold no-underline text-center'
                href={verifyLink}>
                Reset Password
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
