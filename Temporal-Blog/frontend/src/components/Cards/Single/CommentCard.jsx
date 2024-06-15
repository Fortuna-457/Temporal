import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Spinner, Typography } from '@material-tailwind/react'
import AuthorCard from '../AuthorCard'
import commentSercive from '../../../services/commentService'

export default function CommentCard({ commentId, isLast = false }) {
  const [comment, setComment] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function getComment() {
      try {
        const response = await commentSercive.getCommentById(commentId)

        if (!response.ok) {
          throw new Error('An error occurred while fetching the comment')
        }

        setComment(response.body)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    getComment()
  }, [commentId])

  return loading ? (
    <Spinner />
  ) : (
    comment.status === 'approved' && (
      <div className='p-4'>
        <div className='flex items-center gap-4'>
          {comment.userId ? (
            <AuthorCard
              authorId={comment.userId}
              date={format(new Date(comment.createdAt), 'MMMM dd, yyyy')}
            />
          ) : (
            <Typography
              variant='h6'
              color='gray'
              className='dark:text-gray-200 '
            >
              {comment.userName}
            </Typography>
          )}
        </div>
        <div
          className={`pb-7 ml-16 mt-4 border-gray-300 dark:border-gray-700 ${
            isLast ? `border-none` : `border-b`
          }`}
        >
          <Typography
            variant='paragraph'
            color='gray'
            className='dark:text-gray-200 '
          >
            {comment.content}
          </Typography>
        </div>
      </div>
    )
  )
}
