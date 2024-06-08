import React, { useEffect, useState } from 'react'
import BlogPostCard from '../../components/Cards/BlogPostCard'
import postService from '../../services/postService'
import { Spinner } from '@material-tailwind/react'
import DefaultPagination from '../../components/Pagination/DefaultPagination'

function Blog() {
  const [posts, setPosts] = useState([])
  const [url, setUrl] = useState({
    limit: 5,
    page: 1
  })
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)

  /**
   * This only runs once when the component mounts
   * It fetches the posts from the server
   * and saves in the posts state
   */
  useEffect(() => {
    async function getPosts() {
      try {
        // Fetch the posts from the server
        const response = await postService.getAllPosts(url)

        if (!response.ok) {
          console.log('Failed to get posts')
          return
        }

        // Extract the posts from the response
        const posts = response.body.posts

        // Save the posts in the state
        setPosts(posts)
        setPagination(response.body.pagination)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Error getting posts', error)
        toast.showError('Error getting posts')
      }
    }

    getPosts()
  }, [url])

  console.log('Pagination:', pagination)
  return loading ? (
    <div className='flex justify-center pt-10'>
      <Spinner />
    </div>
  ) : (
    <div className='flex flex-col gap-4'>
      {posts.map((post) => {
        if (post.status == 'published') {
          return <BlogPostCard key={post.id} post={post} />
        }
      })}
      <div className='flex items-center justify-between border-t border-blue-gray-50 p-4'>
        {loading ? (
          <Spinner />
        ) : (
          <DefaultPagination {...pagination} url={url} setUrl={setUrl} />
        )}
      </div>
    </div>
  )
}

export default Blog
