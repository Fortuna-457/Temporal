import React, { useState } from 'react'
import PostForm from '../../../components/Forms/PostForm'
import useAuth from '../../../hooks/useAuth'
import postService from '../../../services/postService'
import useAlertToast from '../../../hooks/useToast'
import { useNavigate } from 'react-router'

export default function CreatePost() {
  const { userId } = useAuth()
  const { toast } = useAlertToast()
  const { roleName } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState({
    title: '',
    description: '',
    userId,
    thumbnail: '',
    content: '',
    categories: [],
    tags: [],
    status: 'draft'
  })

  const handleInputChange = (e) => {
    // Deconstruct the name and value from the target
    const { name, value } = e.target

    // Update the state
    setPost({ ...post, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if main fields are empty
    if (!post.title || !post.content) {
      toast.showError('Title and content are required')
      return
    }

    switch (roleName) {
      case 'CONTRIBUTOR':
        // Check if user is editing their own post
        if (post.userId !== parseInt(userId)) {
          toast.showError(
            'You are not allowed to create posts by other authors'
          )
          return
        }

        // Check if the post is published
        if (post.status === 'published') {
          toast.showError('You are not allowed to publish posts')
          return
        }

        break
      case 'AUTHOR':
        // Check if user is editing their own post
        if (post.userId !== parseInt(userId)) {
          toast.showError(
            'You are not allowed to create posts by other authors'
          )
          return
        }
      case 'SUBSCRIBER':
        toast.showError('You are not allowed to create posts')
        return
        break
      default:
        break
    }

    try {
      // Save the post
      const response = await postService.createPost(post)

      console.log('Response:', response)
      if (!response.ok) {
        toast.showError('Error creating post' || response.message)
        return
      }
      console.log('Passed if')

      toast.showSuccess('Post created successfully')

      console.log('message shown')
      console.log('Post:', post)

      navigate('/wt-content/posts')
    } catch (error) {
      toast.showError('Error creating post')
      console.log('Post:', post)
    }
  }

  return (
    <PostForm
      post={post}
      setPost={setPost}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      title='Create Post'
    />
  )
}
