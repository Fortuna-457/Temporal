import { useAvatarPreview } from '../../hooks/useImagePreview'
import { IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import AuthorCard from '../Cards/AuthorCard'
import useAuth from '../../hooks/useAuth'
import { format } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import useAlertToast from '../../hooks/useToast'
import userService from '../../services/userService'

const UserAvatar = ({ avatar }) => {
  const avatarPreview = useAvatarPreview(avatar)

  return (
    <img
      className='h-14 w-14 rounded-lg object-cover object-center mx-auto'
      src={avatarPreview}
      alt='User avatar'
    />
  )
}

export default function TableAdminUsers({ users, url, setUrl }) {
  const { roleName } = useAuth()
  const { toast } = useAlertToast()
  const navigate = useNavigate()

  return users.map(
    ({ id, displayName, username, picture, createdAt }, index) => {
      const isLast = index === users.length - 1
      const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'

      return (
        <tr key={username}>
          <td className={classes}>
            <UserAvatar avatar={picture} />
          </td>
          <td className={classes}>
            <div className='flex flex-col'>
              <Typography
                variant='small'
                color='blue-gray'
                className='font-normal dark:text-gray-200'
              >
                {username}
              </Typography>
            </div>
          </td>
          <td className={classes}>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal dark:text-gray-200'
            >
              {displayName}
            </Typography>
          </td>
          <td className={classes}>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal dark:text-gray-200'
            >
              {format(new Date(createdAt), 'MMM dd, yyyy')}
            </Typography>
          </td>
          <td className={classes}>
            <Tooltip
              content='Edit'
              className='dark:text-gray-900 dark:bg-gray-100'
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 }
              }}
            >
              <IconButton
                variant='text'
                className='dark:hover:bg-blue-gray-800 dark:text-gray-200'
                disabled={roleName != 'ADMIN'}
                onClick={() => {
                  navigate('/wt-content/users/edit/' + id)
                }}
              >
                <PencilSquareIcon width={20} />
              </IconButton>
            </Tooltip>
            <Tooltip
              content='Delete'
              className='dark:text-gray-900 dark:bg-gray-100'
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 }
              }}
            >
              <IconButton
                variant='text'
                className='dark:hover:bg-blue-gray-800 dark:text-gray-200'
                disabled={roleName !== 'ADMIN'}
                onClick={async () => {
                  try {
                    const response = await userService.deleteUser(id)

                    console.log('response', response)
                    if (!response.ok) {
                      console.error('Error deleting User', response)
                      toast.showError(
                        `Failed to delete User status code: ${response.statusCode}`
                      )
                    }

                    toast.showSuccess('User deleted successfully')
                    setUrl({ ...url }) // Refresh the page
                  } catch (error) {
                    console.error('Error deleting User', error)
                    toast.showError('Failed to delete User')
                  }
                }}
              >
                <TrashIcon width={20} />
              </IconButton>
            </Tooltip>
          </td>
        </tr>
      )
    }
  )
}
