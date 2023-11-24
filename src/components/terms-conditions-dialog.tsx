import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export default function TermsConditionsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='text-primary hover:underline'>
          terms and conditions
        </button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Terms & Conditions</DialogTitle>
        </DialogHeader>
        <div className='grid gap-2'>
          <p>
            Welcome to MCCD Air Care Trading Services! We appreciate your
            interest in our products/services, and we want to ensure a
            transparent and secure experience for all users. These Terms and
            Conditions govern your use of our website, mobile applications, and
            any related services provided by MCCD Air Care Trading Services.
            Here is the list of Terms and Conditions:
          </p>
          <div>
            <p className='font-semibold'>1. Appointment Cancellation Policy</p>
            <div className='ml-4'>
              <p>
                <span className='font-semibold'>1.1 No refunds: </span>
                Once the appointment is confirmed, cancellation is not possible
                as it will already be recorded in the system and given priority
                by our company.
              </p>
            </div>
          </div>
          <div>
            <p className='font-semibold'>2. Rescheduling Policy</p>
            <div className='ml-4'>
              <p>
                <span className='font-semibold'>2.1 Rescheduling: </span>
                You must go through the scheduling process again and submit a
                payment screenshot, such as a Gcash Receipt, PayMaya Receipt, or
                Bank Transfer Receipt, etc. Once the appointment is confirmed
                and finalized, the rescheduling process cannot be canceled, as
                there is no refund available for this procedure.
              </p>
            </div>
          </div>
          <div>
            <p className='font-semibold'>
              3. Collection of Information (Data Privacy) Policy
            </p>
            <div className='ml-4'>
              <p>
                <span className='font-semibold'>3.1 Data Collection: </span>
                We collect information that is necessary for the provision of
                our services and the improvement of user experience. Types of
                information collected may include but are not limited to
                personal details, contact information, and usage data.
              </p>
              <p>
                <span className='font-semibold'>
                  3.2 Purpose of Data Collection:{' '}
                </span>
                The collected data is utilized for fulfilling user-requested
                services, communicating updates and promotions, and improving
                products and services through user feedback.
              </p>
              <p>
                <span className='font-semibold'>3.3 User Consent: </span>
                By using our services, you consent to the collection and
                processing of your information in accordance with these terms.
                Consent may be withdrawn at any time by contacting us at our
                contact number +63 998 576 3538 or email: aircare116@gmail.com
              </p>
            </div>
          </div>
          <p>
            By accessing or using our platform, you agree to abide by these
            Terms, which outline the rules and regulations governing the
            relationship between you and MCCD Air Care Trading Services. Please
            carefully read through the following sections, as they contain
            important information regarding your rights, responsibilities, and
            the terms under which MCCD Air Care Trading Services provides its
            services. Your continued use of our platform implies your acceptance
            of these Terms.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
