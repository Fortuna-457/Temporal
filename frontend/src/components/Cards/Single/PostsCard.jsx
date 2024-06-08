import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ButtonGroup, Spinner, Typography } from '@material-tailwind/react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button
} from '@material-tailwind/react'
import categoryService from '../../../services/categoryService'
import postService from '../../../services/postService'
import { usePostThumbnailPreview } from '../../../hooks/useImagePreview'
import useTruncatedText from '../../../hooks/useTruncatedText'

function PostCard({ post, isLast = false, onClick }) {
  const preview = usePostThumbnailPreview(post.thumbnail)
  const truncatedTitle = useTruncatedText(post.title, 50)
  const truncatedContent = useTruncatedText(post.content, 100)

  return (
    <Card
      className={`w-full md:w-1/3 rounded-none border-gray-300 dark:border-gray-600 dark:bg-gray-800 ${
        isLast ? 'md:border-r-0' : 'md:border-r'
      }`}
      shadow={false}
    >
      <CardHeader
        shadow={false}
        floated={false}
        color='blue-gray'
        className='relative h-56'
      >
        <img
          src={preview}
          alt='card-image'
          className='w-full h-full object-cover'
        />
      </CardHeader>
      <CardBody>
        <Typography
          variant='h5'
          color='blue-gray'
          className='mb-2 dark:text-gray-200'
        >
          {truncatedTitle}
        </Typography>
        <Typography
          className='dark:text-gray-200'
          dangerouslySetInnerHTML={{ __html: truncatedContent }}
        />
      </CardBody>
      <CardFooter className='pt-0'>
        <Button onClick={onClick}>Read More</Button>
      </CardFooter>
    </Card>
  )
}

export default function PostsCard({
  categories = null,
  title = null,
  excludedPostId
}) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function getRelatedPosts() {
      try {
        const response = await categoryService.getPosts(categories[0], {
          limit: 3
        })

        if (!response.ok) {
          throw new Error('An error occurred while fetching the posts')
        }

        setPosts(response.body.posts)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    async function getPosts() {
      try {
        const response = await postService.getAllPosts({ limit: 3 })

        if (!response.ok) {
          throw new Error('An error occurred while fetching the posts')
        }

        setPosts(response.body.posts)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    if (categories) {
      getRelatedPosts()
    } else {
      getPosts()
    }
  }, [categories])

  return loading ? (
    <Spinner />
  ) : posts ? (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-4'>
      {title ? (
        <div className='p-4 mb-3'>
          <Typography variant='h4' className='dark:text-gray-200'>
            {title}
          </Typography>
        </div>
      ) : null}
      <div>
        <div className='flex flex-col md:flex-row justify-center rounded-xl gap-[.1rem]'>
          {posts.map(
            (post) =>
              post.id !== excludedPostId && (
                <PostCard
                  key={post.id}
                  post={post}
                  isLast={post.id === posts[posts.length - 1].id}
                  onClick={() => navigate(`/posts/${post.id}`)}
                />
              )
          )}
        </div>
      </div>
    </div>
  ) : (
    <Typography variant='h6' color='gray'>
      No posts found...
    </Typography>
  )
}
