import React, { useEffect, useRef, useState } from 'react'

import { useParams } from 'react-router-dom'
import postService from '../../../services/postService'
import categoryService from '../../../services/categoryService'
import tagService from '../../../services/tagService'
import useAlertToast from '../../../hooks/useToast'
import useAuth from '../../../hooks/useAuth'

import PostForm from '../../../components/Forms/PostForm'

export default function EditPost() {
  let { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useAlertToast()
  const { userId, roleName } = useAuth()

  const [post, setPost] = useState({
    id: '',
    title: '',
    content: '',
    thumbnail: '',
    status: 'published',
    userId: '',
    categories: [],
    tags: []
  })

  useEffect(() => {
    async function getPost() {
      try {
        const response = await postService.getPostById(id)

        if (!response.ok) {
          console.log('Failed to get posts')
          return
        }

        const post = await response.body

        // Get categories
        const categories = await getCategoriesOfPost(post)
        post.categories = categories

        // Get tags
        const tags = await getTagsOfPost(post)
        post.tags = tags

        setPost(post)
      } catch (error) {
        toast.showError('Error getting post:', error)
      }
    }

    async function getCategoriesOfPost(post) {
      try {
        const categoryPromises = post.categories.map(async (category) => {
          const response = await categoryService.getCategoryById(category)
          if (!response.ok) {
            console.log('Failed to get category')
            return null // Return null
          }
          return response.body
        })

        const categories = await Promise.all(categoryPromises)

        return categories
      } catch (error) {
        toast.showError('Error getting categories:', error)
      }
    }

    async function getTagsOfPost(post) {
      try {
        const tagsPromises = post.tags.map(async (tag) => {
          const response = await tagService.getTagById(tag)
          if (!response.ok) {
            console.log('Failed to get tag')
            return null // Return null
          }
          return response.body
        })

        const tags = await Promise.all(tagsPromises)

        return tags
      } catch (error) {
        toast.showError('Error getting tags:', error)
      }
    }

    async function loadPage() {
      await getPost()

      setIsLoading(false)
    }

    loadPage()
  }, [])

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()

    // Check if main fields are empty
    if (!post.title || !post.content) {
      toast.showError('Title and content are required')
      return
    }

    switch (roleName) {
      case 'CONTRIBUTOR':
        // Check if user is editing their own post
        if (post.userId !== parseInt(userId)) {
          toast.showError('You are not allowed to edit posts by other authors')
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
          toast.showError('You are not allowed to edit posts by other authors')
          return
        }
      case 'SUBSCRIBER':
        toast.showError('You are not allowed to edit posts')
        return
        break
      default:
        break
    }

    try {
      // Call the update post service
      const response = await postService.updatePost(post)

      if (!response.ok) {
        console.error('Error updating post:', response)
        toast.showError(`Error updating post ${response.message}`)
        return
      }

      // Show a success message
      toast.showSuccess('Post updated successfully')

      setPost(response.body)

      console.log('Post:', post)

      // Force a reload of the page
      window.location.reload()
    } catch (error) {
      console.error('Error updating post:', error)
      toast.showError(`Error updating post ${error.message}`)
    }
  }

  /**
   * Handle the input change event and update the state
   * @param {Event} e The event object
   */
  const handleInputChange = (e) => {
    // Deconstruct the name and value from the target
    const { name, value } = e.target

    // Update the state
    setPost({ ...post, [name]: value })
  }

  return (
    <PostForm
      post={post}
      setPost={setPost}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  )
}
