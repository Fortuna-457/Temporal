import React from 'react'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useAlertToast from '../../hooks/useToast'
import { useAvatarPreview } from '../../hooks/useImagePreview'
import { IconButton, Tooltip } from '@material-tailwind/react'

export default function AdminAuthorSidebarCard({ expanded }) {
  const { displayName, email, picture } = useAuth()

  const preview = useAvatarPreview(picture)
  const signOut = useSignOut()
  const navigate = useNavigate()
  const { toast } = useAlertToast()

  const handleSignOut = () => {
    // Sign out the user
    signOut()

    // Redirect to the home page
    navigate('/')

    // Show a toast message
    toast.showSuccess('You have been signed out')
  }

  return (
    <div
      className={`border-t border-gray-300 dark:border-gray-700 flex  p-3 ${
        expanded ? 'flex-row gap-1' : 'flex-col gap-3'
      }`}
    >
      <img
        src={preview}
        alt=''
        className={`w-10 h-10 rounded-md  ${!expanded && 'order-1'}`}
      />
      <div
        className={`w-full flex ${
          expanded ? 'justify-between' : 'justify-center'
        } items-center`}
      >
        <div
          className={`leading-4 overflow-hidden ${
            expanded ? 'w-full ml-3 pr-1' : 'w-0'
          }`}
        >
          <h4 className='font-semibold dark:text-gray-200'>{displayName}</h4>
          <span className='text-xs text-gray-600 dark:text-gray-400'>
            {email}
          </span>
        </div>
        <Tooltip
          content='Sign out'
          placement='right'
          className='dark:text-gray-900 dark:bg-gray-100'
          animate={{
            mount: { scale: 1, x: 25 },
            unmount: { scale: 0, x: 0 }
          }}
        >
          <IconButton
            variant='text'
            onClick={handleSignOut}
            className='dark:hover:bg-blue-gray-800 dark:text-gray-200'
          >
            <ArrowLeftStartOnRectangleIcon width={24} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
