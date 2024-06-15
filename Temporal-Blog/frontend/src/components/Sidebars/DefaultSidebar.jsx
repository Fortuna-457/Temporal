import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import {
  Avatar,
  Card,
  Chip,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  Typography
} from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import categoryService from '../../services/categoryService'
import tagService from '../../services/tagService'
import postService from '../../services/postService'
import userService from '../../services/userService'
import { Link } from 'react-router-dom'
import {
  useAvatarPreview,
  usePostThumbnailPreview
} from '../../hooks/useImagePreview'
import { format } from 'date-fns'

function PostCard({ post }) {
  const preview = usePostThumbnailPreview(post.thumbnail)
  return (
    <Link to={`/posts/${post.id}`}>
      <ListItem className='hover:bg-gray-300 dark:hover:bg-gray-800'>
        <div>
          <Typography variant='h6' color='gray' className='dark:text-gray-100'>
            {post.title}
          </Typography>
          <Typography
            variant='small'
            color='gray'
            className='font-normal dark:text-gray-100'
          >
            {format(new Date(post.createdAt), 'MMM dd, yyyy')}
          </Typography>
        </div>
      </ListItem>
    </Link>
  )
}

function AuthorCard({ author }) {
  const preview = useAvatarPreview(author.picture)

  return (
    <Link to={`/authors/${author.id}`}>
      <ListItem className='hover:bg-gray-300 dark:hover:bg-gray-800'>
        <ListItemPrefix>
          <Avatar src={preview} variant='circular' />
        </ListItemPrefix>
        <Typography
          variant='h6'
          color='blue-gray'
          className='dark:text-gray-100'
        >
          {author.displayName}
        </Typography>
      </ListItem>
    </Link>
  )
}

export default function DefaultSidebar() {
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [lastPosts, setLastPosts] = useState([])
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await categoryService.getAllCategories()

        if (!response.ok) {
          console.log('Failed to get categories')
          return
        }

        const categories = response.body.categories
        setCategories(categories)
      } catch (error) {
        console.error('Error getting categories', error)
        toast.showError('Error getting categories')
      }
    }

    async function getTags() {
      try {
        const response = await tagService.getAllTags()

        if (!response.ok) {
          console.log('Failed to get tags')
          return
        }

        const tags = response.body.tags
        setTags(tags)
      } catch (error) {
        console.error('Error getting tags', error)
        toast.showError('Error getting tags')
      }
    }

    async function getLastPosts() {
      try {
        const response = await postService.getAllPosts({ limit: 5 })

        if (!response.ok) {
          console.log('Failed to get last posts')
          return
        }

        const posts = response.body.posts
        setLastPosts(posts)
      } catch (error) {
        console.error('Error getting last posts', error)
        toast.showError('Error getting last posts')
      }
    }

    async function getAuthors() {
      try {
        const response = await userService.getAllUsers()

        if (!response.ok) {
          console.log('Failed to get authors')
          return
        }

        const authors = response.body.users
        setAuthors(authors)
      } catch (error) {
        console.error('Error getting authors', error)
        toast.showError('Error getting authors')
      }
    }

    getCategories()
    getTags()
    getLastPosts()
    getAuthors()
  }, [])

  return (
    <aside className='h-full z-40'>
      <Card className='h-full w-full lg:max-w-[18rem] p-4 shadow-xl shadow-blue-gray-900/5 dark:bg-gray-800'>
        <div className='mb-3'>
          <Input
            icon={<MagnifyingGlassIcon className='h-5 w-5' />}
            className='dark:text-gray-100 '
            label='Search'
          />
        </div>
        <div className='mb-3'>
          <Card className='w-full p-2 drop-shadow-sm bg-gray-200 dark:bg-gray-700'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='border-b border-gray-300 pb-2 mb-2 dark:text-gray-100'
            >
              Categories
            </Typography>
            <div className='mb-2 flex flex-wrap gap-1'>
              {categories.map((category) => (
                <Link key={category.id} to={`/categories/${category.id}`}>
                  <Chip
                    value={category.name}
                    size='sm'
                    variant='filled'
                    className='rounded-full cursor-pointer hover:bg-gray-800'
                  />
                </Link>
              ))}
            </div>
          </Card>
        </div>
        <div className='mb-3'>
          <Card className='w-full p-2 drop-shadow-sm  bg-gray-200 dark:bg-gray-700'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='border-b border-gray-300 pb-2 mb-2 dark:text-gray-100'
            >
              Tags
            </Typography>
            <div className='mb-2 flex flex-wrap gap-1 '>
              {tags.map((tag) => (
                <Link key={tag.id} to={`/tags/${tag.id}`}>
                  <Chip
                    value={tag.name}
                    size='sm'
                    variant='filled'
                    className='rounded-full cursor-pointer hover:bg-gray-800'
                  />
                </Link>
              ))}
            </div>
          </Card>
        </div>
        <div className='mb-3'>
          <Card className='w-full p-2 drop-shadow-sm  bg-gray-200 dark:bg-gray-700'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='border-b border-gray-300 pb-2 mb-2 dark:text-gray-100'
            >
              Last entries
            </Typography>
            <div className='mb-2 flex flex-wrap gap-1'>
              <List className='w-full p-0'>
                {lastPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </List>
            </div>
          </Card>
        </div>
        <div className='mb-3'>
          <Card className='w-full p-2 drop-shadow-sm  bg-gray-200 dark:bg-gray-700'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='border-b border-gray-300 pb-2 mb-2 dark:text-gray-100'
            >
              Authors
            </Typography>
            <div className='mb-2 flex flex-wrap gap-1'>
              <List className='w-full p-0'>
                {authors.map((author) => (
                  <AuthorCard key={author.id} author={author} />
                ))}
              </List>
            </div>
          </Card>
        </div>
      </Card>
    </aside>
  )
}
