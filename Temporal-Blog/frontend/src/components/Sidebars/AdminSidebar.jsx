import React, { createContext, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ChatBubbleBottomCenterTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  NewspaperIcon,
  TagIcon,
  UserCircleIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import AdminAuthorSidebarCard from '../Cards/AdminAuthorSidebarCard'
import { IconButton, List, ListItem } from '@material-tailwind/react'
import ColorModeSwitcher from '../Buttons/ColorModeSwitcher'
const SidebarContext = createContext(null)

export default function AdminSidebar({ expanded, onClick }) {
  return (
    <aside className='h-screen p-2 sticky top-0 z-50'>
      <nav className='h-full flex flex-col bg-white dark:bg-blue-gray-900 shadow-sm rounded-lg'>
        <div
          className={`p-2 pb-2 flex items-center ${
            expanded ? 'justify-between' : 'justify-center'
          }`}
        >
          <Link
            to={'/'}
            className={`dark:text-gray-200 dark:hover:bg-blue-gray-800 rounded-md ${
              expanded ? 'p-2' : 'p-0'
            }`}
          >
            <GlobeAltIcon width={expanded ? 28 : 0} />
          </Link>
          <IconButton
            variant='text'
            onClick={onClick}
            className='dark:text-gray-200 dark:hover:bg-blue-gray-800'
          >
            {expanded ? (
              <ChevronLeftIcon width={28} />
            ) : (
              <ChevronRightIcon width={28} />
            )}
          </IconButton>
        </div>

        <SidebarContext.Provider value={{ expanded: expanded }}>
          <List className='flex-1 min-w-0'>
            <SidebarItem
              icon={<ComputerDesktopIcon width={24} />}
              text={'Dashboard'}
              link={'/wt-content/dashboard'}
            />
            <SidebarItem
              icon={<NewspaperIcon width={24} />}
              text={'Posts'}
              link={'/wt-content/posts'}
            />
            <SidebarItem
              icon={<ChatBubbleBottomCenterTextIcon width={24} />}
              text={'Comments'}
              link={'/wt-content/comments'}
            />
            <SidebarItem
              icon={<DocumentTextIcon width={24} />}
              text={'Categories'}
              link={'/wt-content/categories'}
            />
            <SidebarItem
              icon={<TagIcon width={24} />}
              text={'Tags'}
              link={'/wt-content/tags'}
            />
            <SidebarItem
              icon={<UsersIcon width={24} />}
              text={'Users'}
              link={'/wt-content/users'}
            />
            <SidebarItem
              icon={<UserCircleIcon width={24} />}
              text={'Profile'}
              link={'/wt-content/profile'}
            />
            <hr className='my-3 border-gray-300 dark:border-gray-700' />
            <SidebarItem
              icon={<Cog6ToothIcon width={24} />}
              text={'Settings'}
              link={'/wt-content/settings'}
            />
            <SidebarItem
              icon={<ColorModeSwitcher />}
              text={'Theme'}
              className={'p-0'}
            />
          </List>
        </SidebarContext.Provider>

        <AdminAuthorSidebarCard expanded={expanded} />
      </nav>
    </aside>
  )
}

export function SidebarItem({
  icon,
  text,
  alert,
  link = '/wt-content',
  className
}) {
  const { expanded } = useContext(SidebarContext)

  // Determine if the current link is active
  const location = useLocation()
  const isActive = location.pathname === link

  return (
    <NavLink
      to={link}
      aria-current='page'
      className={(isActive) => isActive ?? 'active'}
    >
      <ListItem
        className={`
        relative flex items-center
        font-medium rounded-md cursor-pointer
        transition-colors group dark:text-gray-200 dark:hover:bg-blue-gray-800
        ${
          isActive
            ? 'bg-gray-300 dark:bg-blue-gray-700 dark:text-gray-100'
            : 'hover:bg-indigo-50 text-gray-600'
        }
        ${!expanded ? className : ''}
    `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? 'w-52 ml-3' : 'w-0'
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? '' : 'top-2'
            }`}
          />
        )}

        {!expanded && (
          <div
            className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-black text-gray-100  text-sm dark:bg-gray-100 dark:text-gray-900  
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
          >
            {text}
          </div>
        )}
      </ListItem>
    </NavLink>
  )
}
