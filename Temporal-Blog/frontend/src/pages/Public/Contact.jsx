import React from 'react'
import { Button, Input, Textarea, Typography } from '@material-tailwind/react'
import DefaultNavbar from '../../components/Navbar/DefaultNavbar'
import { DefaultFooter } from '../../components/Footer/DefaultFooter'
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function Contact() {
  return (
    <div className='flex flex-col bg-gray-200 dark:bg-gray-900'>
      <DefaultNavbar />
      <main className='pt-10'>
        <section className='px-8 lg:py-16'>
          <div className='container mx-auto text-center'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='mb-4 !text-base lg:!text-2xl dark:text-gray-200'
            >
              Customer Care
            </Typography>
            <Typography
              variant='h1'
              color='blue-gray'
              className='mb-4 !text-3xl lg:!text-5xl dark:text-gray-200'
            >
              We&apos;re Here to Help
            </Typography>
            <Typography className='mb-10 font-normal !text-lg lg:mb-20 mx-auto max-w-3xl text-gray-500 dark:text-gray-400'>
              Whether it&apos;s a question about our services, a request for
              technical assistance, or suggestions for improvement, our team is
              eager to hear from you.
            </Typography>
            <div className='flex flex-col md:flex-row md:justify-center items-center gap-10'>
              <form action='#' className='flex flex-col gap-4 md:w-1/2 p-8'>
                <Typography
                  variant='small'
                  className='text-left !font-semibold text-gray-600 dark:text-gray-400'
                >
                  Select Options for Business Engagement
                </Typography>
                <div className='flex gap-4'>
                  <Button
                    variant='outlined'
                    className='max-w-fit dark:text-gray-300 dark:border-gray-200'
                  >
                    General inquiry
                  </Button>
                  <Button
                    variant='outlined'
                    className='max-w-fit dark:text-gray-300 dark:border-gray-200'
                  >
                    Product Support
                  </Button>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Typography
                      variant='small'
                      className='mb-2 text-left font-medium text-gray-900 dark:text-gray-300'
                    >
                      First Name
                    </Typography>
                    <Input
                      color='gray'
                      size='lg'
                      placeholder='First Name'
                      name='first-name'
                      className='focus:!border-t-gray-500 dark:text-gray-300'
                      containerProps={{
                        className: 'min-w-full'
                      }}
                      labelProps={{
                        className: 'hidden'
                      }}
                    />
                  </div>
                  <div>
                    <Typography
                      variant='small'
                      className='mb-2 text-left font-medium text-gray-900 dark:text-gray-300'
                    >
                      Last Name
                    </Typography>
                    <Input
                      color='gray'
                      size='lg'
                      placeholder='Last Name'
                      name='last-name'
                      className='focus:!border-t-gray-900  dark:text-gray-300'
                      containerProps={{
                        className: '!min-w-full'
                      }}
                      labelProps={{
                        className: 'hidden'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Typography
                    variant='small'
                    className='mb-2 text-left font-medium text-gray-900  dark:text-gray-300'
                  >
                    Your Email
                  </Typography>
                  <Input
                    color='gray'
                    size='lg'
                    placeholder='name@email.com'
                    name='email'
                    className='focus:!border-t-gray-900  dark:text-gray-300'
                    containerProps={{
                      className: '!min-w-full'
                    }}
                    labelProps={{
                      className: 'hidden'
                    }}
                  />
                </div>
                <div>
                  <Typography
                    variant='small'
                    className='mb-2 text-left font-medium text-gray-900 dark:text-gray-300'
                  >
                    Your Message
                  </Typography>
                  <Textarea
                    rows={6}
                    color='gray'
                    placeholder='Message'
                    name='message'
                    className='focus:!border-t-gray-900  dark:text-gray-300'
                    containerProps={{
                      className: '!min-w-full'
                    }}
                    labelProps={{
                      className: 'hidden'
                    }}
                  />
                </div>
                <Button className='w-full dark:bg-black'>Send message</Button>
              </form>
              <div className='md:w-1/2 p-8 text-start'>
                <Typography
                  variant='h1'
                  color='blue-gray'
                  className='mb-4 !text-3xl lg:!text-5xl dark:text-gray-200'
                >
                  Get in Touch
                </Typography>
                <Typography className='mb-10 font-normal !text-lg mx-auto max-w-3xl !text-gray-500'>
                  You need more information? Check what other persons are saying
                  about our product. They are very happy to help you.
                </Typography>
                <div className='flex flex-col gap-6'>
                  <div className='flex gap-5'>
                    <PhoneIcon width={28} className='dark:text-gray-200' />
                    <Typography
                      variant='h6'
                      color='blue-gray'
                      className='dark:text-gray-200'
                    >
                      +1 (234) 567-8901
                    </Typography>
                  </div>
                  <div className='flex gap-5'>
                    <EnvelopeIcon width={28} className='dark:text-gray-200' />
                    <Typography
                      variant='h6'
                      color='blue-gray'
                      className='dark:text-gray-200'
                    >
                      support@temporal.com
                    </Typography>
                  </div>
                  <div className='flex gap-5'>
                    <MapPinIcon width={28} className='dark:text-gray-200' />
                    <Typography
                      variant='h6'
                      color='blue-gray'
                      className='dark:text-gray-200'
                    >
                      Melancoly Ave, 234, Block 1, Temporal City
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <DefaultFooter />
    </div>
  )
}
