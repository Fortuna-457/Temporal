import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import { Button, Typography } from '@material-tailwind/react'
import { Link } from 'react-router-dom'
import DefaultNavbar from '../../components/Navbar/DefaultNavbar'

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-200 dark:bg-gray-900'>
      <DefaultNavbar />
      <main className='grid h-full place-items-center px-6 py-24 sm:py-32 lg:px-8'>
        <div className='text-center'>
          <Typography variant='paragraph' className='dark:text-gray-200'>
            404
          </Typography>
          <Typography variant='h1' className='dark:text-gray-200'>
            Page not found
          </Typography>
          <Typography
            color='gray'
            variant='paragraph'
            className='my-6 dark:text-gray-200'
          >
            The page you’re looking for doesn’t exist.
          </Typography>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Link to={'/'}>
              <Button className='dark:bg-black'>Go back home</Button>
            </Link>
            <Link to={'/contact'}>
              <Button
                variant='text'
                className='flex gap-3 dark:text-gray-200 dark:hover:bg-gray-800'
              >
                Contact support
                <ArrowLongRightIcon width={20} />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
