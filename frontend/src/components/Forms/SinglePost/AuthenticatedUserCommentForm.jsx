import { Button, Textarea } from '@material-tailwind/react'
import useAlertToast from '../../../hooks/useToast'
import useAuth from '../../../hooks/useAuth'
import commentSercive from '../../../services/commentService'
import { useState } from 'react'

export default function AuthenticatedUserCommentForm({ post, setPost }) {
  // Get the user id from the local storage
  const { userId } = useAuth()
  const { toast } = useAlertToast()

  const [comment, setComment] = useState({
    content: '',
    userId,
    postId: post.id
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if the comment is empty
    if (!comment.content) {
      toast.showError('Comment field cannot be empty')
      return
    }

    console.log('Comment: ', comment)
    try {
      const response = await commentSercive.createComment(comment)

      if (!response.ok) {
        console.log('Failed to create comment: ', response.message)
        toast.showError(response.message || 'Error in request')
        return
      }

      setPost({ ...post, comments: [...post.comments, response.body.id] })
      toast.showSuccess('Comment created successfully')
    } catch (error) {
      console.error(error)
      toast.showError(error.message || 'Error in request')
    }
  }

  return (
    <form>
      <Textarea
        className='w-full h-32 p-2 mb-4 border border-gray-300 dark:border-gray-900 rounded-lg'
        label='Comment'
        onChange={(e) => setComment({ ...comment, content: e.target.value })}
      />
      <Button onClick={handleSubmit}>Comment</Button>
    </form>
  )
}
