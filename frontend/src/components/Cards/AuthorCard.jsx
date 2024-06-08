import React, { useEffect, useState } from 'react'
import userService from '../../services/userService'
import { Link } from 'react-router-dom'
import { Avatar, Spinner, Typography } from '@material-tailwind/react'
import { useAvatarPreview } from '../../hooks/useImagePreview'

export default function AuthorCard({ authorId = null, subText = null }) {
  const [author, setAuthor] = useState({})
  const preview = useAvatarPreview(author.picture)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authorId) return
    async function getAuthor() {
      try {
        const response = await userService.getUserById(authorId)

        if (!response.ok) {
          throw new Error('An error occurred while fetching the author')
        }

        setAuthor(response.body)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    getAuthor()
  }, [authorId])

  return loading ? (
    <Spinner />
  ) : (
    <div className='flex items-center gap-4'>
      <Avatar src={preview} alt='avatar' />
      <div>
        <Typography variant='h6' color='gray' className='dark:text-gray-200'>
          <Link to={`/authors/${authorId}`}>{author.displayName}</Link>
        </Typography>
        <Typography
          variant='small'
          color='gray'
          className='font-normal dark:text-gray-400'
        >
          {subText ? subText : author.email}
        </Typography>
      </div>
    </div>
  )
}
