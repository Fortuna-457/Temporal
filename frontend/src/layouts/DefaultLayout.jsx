import React from 'react'
import DefaultNavbar from '../components/Navbar/DefaultNavbar'
import DefaultSidebar from '../components/Sidebars/DefaultSidebar'
import { Typography } from '@material-tailwind/react'
import { DefaultFooter } from '../components/Footer/DefaultFooter'
import bgImage from '../assets/img/bgBlog.jpg'

export default function DefaultLayout({ children, title }) {
  return (
    <div className='bg-gray-200 dark:bg-gray-900'>
      <DefaultNavbar />
      <main className='mb-10'>
        <div className='w-full h-[calc(100vh-60vh)] relative'>
          <img
            src={bgImage}
            alt='TemporalTrek'
            className='absolute inset-0 w-full h-full object-cover'
          />
          <div className='absolute inset-0 h-full w-full bg-black/50 z-0'></div>
          <div className='relative w-full h-full z-10 flex justify-center items-center'>
            <Typography variant='h1' color='white' className='uppercase'>
              {title || 'TemporalTrek'}
            </Typography>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row gap-4 lg:gap-2 container mx-auto -mt-16 pb-4 px-2 lg:px-0'>
          <div className='w-full z-40'>{children}</div>
          <DefaultSidebar />
        </div>
      </main>
      <DefaultFooter />
    </div>
  )
}
