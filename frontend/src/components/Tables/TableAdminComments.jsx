import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { Chip, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import {
  CheckIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import AuthorCard from '../Cards/AuthorCard'
import useAuth from '../../hooks/useAuth'
import useAlertToast from '../../hooks/useToast'
import commentService from '../../services/commentService'

export default function TableAdminComments({ comments, url, setUrl }) {
  const { roleName } = useAuth()
  const { toast } = useAlertToast()

  const truncatedCommentContent = (content) => {
    return content.length > 50 ? content.substring(0, 50) + '...' : content
  }

  const handleChangeStatus = async (id, status) => {
    try {
      console.log('Changing comment status: ', status)

      const response = await commentService.changeStatus(id, status)

      if (!response.ok) {
        console.log('Failed to change comment status', response)
        toast.showError(
          `Failed to change comment status status code: ${response.statusCode}`
        )
        return
      }

      toast.showSuccess('Comment status changed successfully')
      setUrl({ ...url }) // Refresh the page
    } catch (error) {
      console.error('Error changing comment status', error)
      toast.showError('Failed to change comment status')
    }
  }

  return comments.map(
    ({ id, content, status, userId, userName, postId, createdAt }, index) => {
      const isLast = index === comments.length - 1
      const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'

      return (
        <tr key={id}>
          <td className={classes}>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal dark:text-gray-200'
            >
              {id}
            </Typography>
          </td>
          <td className={classes}>
            <div className='flex flex-col'>
              <Typography
                variant='small'
                color='blue-gray'
                className='font-normal dark:text-gray-200'
              >
                {truncatedCommentContent(content)}
              </Typography>
            </div>
          </td>
          <td className={classes}>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal dark:text-gray-200'
            >
              {postId}
            </Typography>
          </td>
          <td className={classes}>
            {userId ? (
              <AuthorCard authorId={userId} />
            ) : (
              <Typography
                variant='small'
                color='blue-gray'
                className='font-normal dark:text-gray-200'
              >
                {userName}
              </Typography>
            )}
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
            <div className='w-max'>
              <Chip
                size='sm'
                value={status == 'approved' ? 'approved' : 'pending'}
                color={status == 'approved' ? 'green' : 'blue-gray'}
              />
            </div>
          </td>
          <td className={classes}>
            {status == 'pending' ? (
              <Tooltip
                content='Approve'
                className='dark:text-gray-900 dark:bg-gray-100'
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 }
                }}
              >
                <IconButton
                  variant='text'
                  className='dark:hover:bg-blue-gray-800 dark:text-gray-200'
                  disabled={roleName != 'ADMIN' && roleName != 'EDITOR'}
                  onClick={() => handleChangeStatus(id, 'approved')}
                >
                  <CheckIcon width={20} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip
                content='Disapprove'
                className='dark:text-gray-900 dark:bg-gray-100'
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 }
                }}
              >
                <IconButton
                  variant='text'
                  className='dark:hover:bg-blue-gray-800 dark:text-gray-200'
                  disabled={roleName != 'ADMIN' && roleName != 'EDITOR'}
                  onClick={() => handleChangeStatus(id, 'pending')}
                >
                  <NoSymbolIcon width={20} />
                </IconButton>
              </Tooltip>
            )}
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
                disabled={roleName != 'ADMIN' && roleName != 'EDITOR'}
                onClick={async () => {
                  try {
                    console.log('Deleting comment', id)
                    const response = await commentService.deleteComment(id)

                    if (!response.ok) {
                      console.log('Failed to delete comment', response)
                      toast.showError(
                        `Failed to delete post status code: ${response.statusCode}`
                      )
                      return
                    }

                    toast.showSuccess('Comment deleted successfully')
                    setUrl({ ...url }) // Refresh the page
                  } catch (error) {
                    console.error('Error deleting comment', error)
                    toast.showError('Failed to delete comment')
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
