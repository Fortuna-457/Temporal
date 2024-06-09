import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ColorModeSwitcher from '../Buttons/ColorModeSwitcher'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import logo from '../../assets/img/logo.png'
export default function DefaultNavbar() {
  const [open, setOpen] = useState(false)
  const isAuthenticated = useIsAuthenticated()

  const linkClass = (isActive) => {
    return isActive
      ? 'px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 lg:mt-0 lg:ml-4 text-gray-900 bg-gray-200'
      : 'px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 lg:mt-0 lg:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
  }

  return (
    <div className='fixed top-0 w-full z-50 pt-2 px-2'>
      <div className='flex flex-col lg:items-center lg:justify-between lg:flex-row container px-4 md:px-6 lg:px-8 mx-auto  text-gray-700 bg-white dark:text-gray-200 dark:bg-blue-gray-900 shadow-sm rounded-xl'>
        <div className='flex flex-row items-center justify-between py-4'>
          <NavLink
            to='/'
            className='text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark:text-white focus:outline-none focus:shadow-outline flex gap-4'
          >
            TemporalTrek
            <img src={logo} alt='logo' className='w-8 h-8' />
          </NavLink>
          <button
            className='rounded-lg lg:hidden focus:outline-none focus:shadow-outline'
            onClick={() => setOpen(!open)}
          >
            <svg fill='currentColor' viewBox='0 0 20 20' className='w-6 h-6'>
              {open ? (
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              ) : (
                <path
                  fillRule='evenodd'
                  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z'
                  clipRule='evenodd'
                />
              )}
            </svg>
          </button>
        </div>
        <nav
          className={`gap-3 flex-col flex-grow ${
            open ? 'flex' : 'hidden'
          } pb-4 lg:pb-0 lg:flex lg:justify-end lg:flex-row text-center`}
        >
          <NavLink
            to='/'
            className={(isActive) => linkClass(isActive.isActive)}
            onClick={() => setOpen(!open)}
          >
            Home
          </NavLink>
          <NavLink
            to='/blog'
            className={(isActive) => linkClass(isActive.isActive)}
            onClick={() => setOpen(!open)}
          >
            Blog
          </NavLink>
          <NavLink
            to='/about'
            className={(isActive) => linkClass(isActive.isActive)}
            onClick={() => setOpen(!open)}
          >
            About
          </NavLink>
          <NavLink
            to='/contact'
            className={(isActive) => linkClass(isActive.isActive)}
            onClick={() => setOpen(!open)}
          >
            Contact
          </NavLink>
          <NavLink
            to='/wt-content'
            className={(isActive) => linkClass(isActive.isActive)}
            onClick={() => setOpen(!open)}
          >
            {isAuthenticated ? 'Admin' : 'Login'}
          </NavLink>
          <div className='flex justify-center'>
            <ColorModeSwitcher />
          </div>
        </nav>
      </div>
    </div>
  )
}
