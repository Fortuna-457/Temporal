import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import AuthorCard from '../Cards/AuthorCard'
import { IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { usePostThumbnailPreview } from '../../hooks/useImagePreview'
import { ArrowLongRightIcon, PencilSquareIcon } from '@heroicons/react/24/solid'

const PostTumbnail = ({ thumbnail }) => {
  const thumbnailPreview = usePostThumbnailPreview(thumbnail)

  return (
    <img
      className='h-14 w-14 rounded-lg object-cover object-center mx-auto'
      src={thumbnailPreview}
      alt='Post image'
    />
  )
}

export default function TableArchives({ posts }) {
  return (
    <table className='mt-0 w-full min-w-max table-auto text-left'>
      <thead>
        <tr>
          <th className='border-y border-blue-gray-100 dark:bg-gray-700 p-4'>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal leading-none opacity-90 dark:text-white'
            >
              Thumbnail
            </Typography>
          </th>
          <th className='border-y border-blue-gray-100 dark:bg-gray-700 p-4'>
            <Typography
              variant='small'
              color='blue-gray'
              className='flex items-center justify-between gap-2 font-normal leading-none opacity-90 dark:text-white'
            >
              Title
            </Typography>
          </th>
          <th className='border-y border-blue-gray-100 dark:bg-gray-700 p-4'>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal leading-none opacity-90 dark:text-white'
            >
              Author
            </Typography>
          </th>
          <th className='border-y border-blue-gray-100 dark:bg-gray-700 p-4'>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal leading-none opacity-90 dark:text-white'
            >
              Date
            </Typography>
          </th>
          <th className='border-y border-blue-gray-100 dark:bg-gray-700 p-4'>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal leading-none opacity-90 dark:text-white'
            >
              Actions
            </Typography>
          </th>
        </tr>
      </thead>
      <tbody>
        {posts.map(
          ({ id, thumbnail, title, userId, createdAt, status }, index) => {
            const isLast = index === posts.length - 1
            const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'

            if (status == 'published') {
              return (
                <tr key={title}>
                  <td className={classes}>
                    <PostTumbnail thumbnail={thumbnail} />
                  </td>
                  <td className={classes}>
                    <div className='flex flex-col'>
                      <Typography
                        variant='small'
                        color='blue-gray'
                        className='font-normal dark:text-gray-100'
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant='small'
                        color='blue-gray'
                        className='font-normal opacity-90 dark:text-gray-100'
                      >
                        Post
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <AuthorCard authorId={userId} />
                  </td>
                  <td className={classes}>
                    <Typography
                      variant='small'
                      color='blue-gray'
                      className='font-normal dark:text-gray-100'
                    >
                      {format(new Date(createdAt), 'MMM dd, yyyy')}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Link to={`/posts/${id}`}>
                      <Tooltip
                        content='Read more'
                        className='dark:text-gray-900 dark:bg-gray-100'
                        animate={{
                          mount: { scale: 1, y: 0 },
                          unmount: { scale: 0, y: 25 }
                        }}
                      >
                        <IconButton
                          variant='text'
                          className='dark:text-gray-100 dark:hover:bg-gray-700'
                        >
                          <ArrowLongRightIcon width={20} />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </td>
                </tr>
              )
            }
          }
        )}
      </tbody>
    </table>
  )
}
