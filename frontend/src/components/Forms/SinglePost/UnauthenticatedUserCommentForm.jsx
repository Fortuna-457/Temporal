import React, { useState } from 'react'
import { Button, Input, Textarea } from '@material-tailwind/react'
import useAlertToast from '../../../hooks/useToast'
import commentSercive from '../../../services/commentService'

export default function UnauthenticatedUserCommentForm({ post, setPost }) {
  const { toast } = useAlertToast()
  const [comment, setComment] = useState({
    content: '',
    postId: post.id,
    userName: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if the user name is empty
    if (!comment.userName) {
      toast.showError('Name field cannot be empty')
      return
    }

    // Check if the comment is empty
    if (!comment.content) {
      toast.showError('Comment field cannot be empty')
      return
    }

    try {
      const response = await commentSercive.createAnonymousComment(comment)

      if (!response.ok) {
        console.log('Failed to create comment: ', response.message)
        toast.showError(response.message || 'Error in request')
        return
      }

      setPost({ ...post, comments: [...post.comments, response.body.id] })
      toast.showSuccess('Comment pending approval')
    } catch (error) {
      console.error(error)
      toast.showError(error.message || 'Error in request')
    }
  }

  return (
    <form>
      <div className='mb-4'>
        <Input
          type='text'
          label='Name'
          placeholder='Your name'
          className='dark:text-gray-200'
          onChange={(e) => setComment({ ...comment, userName: e.target.value })}
          required
        />
      </div>
      <Textarea
        className='w-full h-32 p-2 mb-4 border border-gray-300 dark:text-gray-100 rounded-lg'
        label='Comment'
        onChange={(e) => setComment({ ...comment, content: e.target.value })}
      />
      <Button onClick={handleSubmit}>Comment</Button>
    </form>
  )
}
