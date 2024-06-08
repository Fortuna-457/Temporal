import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TableArchives from '../../components/Tables/TableArchives'
import categoryService from '../../services/categoryService'
import tagService from '../../services/tagService'
import userService from '../../services/userService'
import useAlertToast from '../../hooks/useToast'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
  Typography
} from '@material-tailwind/react'
import DefaultPagination from '../../components/Pagination/DefaultPagination'
import postService from '../../services/postService'
import { set } from 'date-fns'

function Title({ topic, id }) {
  const [title, setTitle] = useState('')

  useEffect(() => {
    async function fetchTitle() {
      let response
      try {
        switch (topic) {
          case 'categories':
            response = await categoryService.getCategoryById(id)

            if (!response.ok) {
              setTitle('Category not found')
              return
            }

            setTitle(`Category: ${response.body.name}`)
            break
          case 'tags':
            response = await tagService.getTagById(id)

            if (!response.ok) {
              setTitle('Tag not found')
              return
            }

            setTitle(`Tag: ${response.body.name}`)
            break
          case 'authors':
            response = await userService.getUserById(id)

            if (!response.ok) {
              setTitle('Author not found')
              return
            }

            setTitle(`Author: ${response.body.displayName}`)
            break
          default:
            setTitle('All Posts')
        }
      } catch (error) {
        console.error('Failed to get title: ', error.message)
      }
    }

    fetchTitle()
  }, [topic, id])

  return <Typography variant='h4'>{title}</Typography>
}

export default function Archives() {
  const { topic, id } = useParams()

  const { toast } = useAlertToast()

  const [posts, setPosts] = useState([])
  const [url, setUrl] = useState({
    page: 1
  })
  const [totalItems, setTotalItems] = useState(0)
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      let response
      try {
        switch (topic) {
          case 'categories':
            response = await categoryService.getPosts(id, url)
            break
          case 'tags':
            response = await tagService.getPosts(id, url)
            break
          case 'authors':
            response = await userService.getPosts(id, url)
            break
          default:
            response = await postService.getAllPosts()
            break
        }

        if (!response.ok) {
          console.log(`No posts found for ${topic}`)
          if (response.statusCode !== 404) {
            return
          }
        }

        const posts = response.body.posts

        // Set total items
        const totalItems = posts.reduce(
          (count, post) => (post.status === 'published' ? count + 1 : count),
          0
        )
        setTotalItems(totalItems)

        setPosts(posts)
        setPagination(response.body.pagination)
        setLoading(false)
      } catch (error) {
        console.error('Failed to get posts: ', error.message)
        toast.showError(error.message || 'Failed to get posts')
        setLoading(false)
      }
    }

    fetchPosts()
  }, [url, topic, id])

  return loading ? (
    <div className='flex justify-center pt-10'>
      <Spinner />
    </div>
  ) : (
    <Card className='w-full dark:bg-gray-800'>
      <CardHeader
        floated={false}
        shadow={false}
        className='m-0 p-5 rounded-b-none bg-gray-300 dark:bg-gray-700'
      >
        <Title topic={topic} id={id} />
        <Typography variant='h5' color='gray' className='dark:text-gray-100'>
          {posts.length === 0 ? 'No' : totalItems} posts found
          {/* 10 posts found */}
        </Typography>
      </CardHeader>
      <CardBody className='overflow-scroll px-0'>
        {posts.length === 0 ? (
          <Typography color='blue-gray' className='text-center mt-8'>
            No posts found
          </Typography>
        ) : (
          <TableArchives posts={posts} />
        )}
      </CardBody>
      <CardFooter className='flex items-center justify-between border-t border-blue-gray-50 p-4'>
        {loading ? (
          <Spinner size='sm' />
        ) : (
          <DefaultPagination {...pagination} url={url} setUrl={setUrl} />
        )}
      </CardFooter>
    </Card>
  )
}
