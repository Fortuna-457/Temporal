import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Typography } from '@material-tailwind/react'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import useAlertToast from '../../hooks/useToast.jsx'
import authService from '../../services/authService.js'
import DefaultNavbar from '../../components/Navbar/DefaultNavbar.jsx'
import CustomLoginInput from '../../components/Inputs/CustomLoginInput.jsx'
import CustomPasswordInput from '../../components/Inputs/CustomPasswordInput.jsx'
import bgImage from '../../assets/img/bgLogin.jpg'
export default function Login() {
  const { toast } = useAlertToast()
  const navigate = useNavigate()
  const signIn = useSignIn()
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  })

  /**
   * Handle the input change event and update the state
   * @param {Event} e The event object
   */
  const handleInputChange = (e) => {
    // Deconstruct the name and value from the target
    const { name, value } = e.target

    // Update the state
    setInputs({ ...inputs, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if the inputs are empty
    if (inputs.username.trim() === '' || inputs.password.trim() === '') {
      toast.showError('All fields are required')
      return
    }

    // Call the signIn function
    try {
      // Make the request to api
      const response = await authService.login(inputs.username, inputs.password)

      // If the response isn't ok, throw an error
      if (!response.ok) {
        toast.showError(response.message || 'Error in request')
        return
      }

      // Call the signIn function with the token and user state, then save it in cookies
      signIn({
        auth: {
          token: response.token,
          type: 'Bearer'
        },
        userState: {
          username: inputs.username
        }
      })

      // Alert the user that the login was successful
      toast.showSuccess(response.message || `Login successfully`)

      // Redirect to admin area
      navigate('/wt-content')
    } catch (error) {
      toast.showError(error.message)
    }
  }

  return (
    <div
      className='min-h-screen bg-gray-200 dark:bg-gray-900 flex flex-col justify-center static'
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        position: 'relative'
      }}
    >
      <div className='absolute top-0 right-0 bottom-0 left-0 z-0 bg-black/25'></div>
      <DefaultNavbar />
      <div className='p-10 xs:p-0 mx-auto md:w-full md:max-w-md static z-10'>
        <Typography variant='h2' className='text-center mb-5 text-gray-200'>
          Login
        </Typography>
        <form className='bg-white dark:bg-gray-800 shadow w-full rounded-lg'>
          <div className='p-5 flex flex-col gap-5'>
            <CustomLoginInput
              label='Username'
              name='username'
              value={inputs.username}
              onChange={handleInputChange}
            />
            <CustomPasswordInput
              label={'Password'}
              name={'password'}
              value={inputs.password}
              onChange={handleInputChange}
            />

            <Button className='flex justify-center' onClick={handleSubmit}>
              <span className='inline-block mr-2'>Login</span>
              <ArrowLongRightIcon width={18} />
            </Button>
          </div>

          <div className='flex items-center px-5 py-2'>
            <hr className='h-0 border-b border-solid  dark:border-gray-700 grow' />
            <p className='mx-4 text-gray-400 dark:text-gray-300'>or</p>
            <hr className='h-0 border-b border-solid  dark:border-gray-700 grow' />
          </div>

          <div className='p-5'>
            <div className='grid grid-cols-3 gap-1'>
              <button
                type='button'
                className='transition duration-200 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md dark:hover:shadow-sm dark:hover:shadow-gray-400 font-normal text-center inline-block'
              >
                Facebook
              </button>
              <button
                type='button'
                className='transition duration-200 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md dark:hover:shadow-sm dark:hover:shadow-gray-400 font-normal text-center inline-block'
              >
                Google
              </button>
              <button
                type='button'
                className='transition duration-200 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md dark:hover:shadow-sm dark:hover:shadow-gray-400 font-normal text-center inline-block'
              >
                Github
              </button>
            </div>
          </div>

          <Link
            to={''}
            className='flex items-center justify-center mx-5 my-2 p-4 text-sm font-medium transition duration-300 rounded-lg text-gray-900 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700'
          >
            <img
              className='h-5 mr-2'
              src='https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png'
              alt=''
            />
            Sign in with Google
          </Link>

          <div className='py-5'>
            <div className='grid grid-cols-2 gap-1'>
              <div className='text-center sm:text-left whitespace-nowrap'>
                <button className='transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className='w-4 h-4 inline-block align-text-top text-white dark:text-gray-300'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z'
                    />
                  </svg>
                  <span className='inline-block ml-1'>Forgot Password?</span>
                </button>
              </div>
              <div className='text-center sm:text-right  whitespace-nowrap'>
                <button className='transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className='w-4 h-4 inline-block align-text-bottom	text-white dark:text-gray-300'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
                    />
                  </svg>
                  <span className='inline-block ml-1'>Help</span>
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className='py-5'>
          <div className='grid grid-cols-2 gap-1'>
            <div className='text-center sm:text-left whitespace-nowrap font-normal text-sm text-gray-100 mx-5'>
              <span className='inline-block'>Don't have an account?</span>
              <Link
                to='/register'
                className='font-bold ml-2 hover:text-gray-400'
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
