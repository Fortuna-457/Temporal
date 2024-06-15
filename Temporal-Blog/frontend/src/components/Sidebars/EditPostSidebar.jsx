import React from 'react'
import { useState, useEffect } from 'react'
import useAlertToast from '../../hooks/useToast'
import useAuth from '../../hooks/useAuth'
import {
  Card,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemSuffix,
  Option,
  Select,
  Spinner,
  Typography
} from '@material-tailwind/react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import userService from '../../services/userService'
import EditPostThumbnail from '../EditPostThumbnail'

export default function EditPostSidebar({ post, setPost }) {
  const { toast } = useAlertToast()
  const { roleName } = useAuth()
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getAuthors() {
      try {
        const response = await userService.getAllUsers({ limit: 100 })

        if (!response.ok) {
          console.log('Failed to get authors')
          return
        }

        const authors = await response.body.users

        setAuthors(authors)
        setLoading(false)
      } catch (error) {
        toast.showError('Error getting authors:', error)
        setLoading(false)
      }
    }

    getAuthors()
  }, [])

  const handleNewCategory = (evt) => {
    // Check if the category is empty
    if (!category) {
      toast.showError('Category name cannot be empty')
      return
    }

    // Check if the category already exists
    const exists = post.categories.find(
      (cat) => cat.name.toLowerCase() === category.toLowerCase()
    )

    if (exists) {
      toast.showError('Category already exists')
      return
    }

    // Add the category to the post
    setPost({
      ...post,
      categories: [...post.categories, { name: category }]
    })
  }

  const handleDeleteCategory = (category) => {
    setPost({
      ...post,
      categories: post.categories.filter((cat) => cat.name !== category.name)
    })
  }

  const handleNewTag = (evt) => {
    // Check if the tag is empty
    if (!tag) {
      toast.showError('Tag name cannot be empty')
      return
    }

    // Check if the tag already exists
    const exists = post.tags.find(
      (ta) => ta.name.toLowerCase() === tag.toLowerCase()
    )

    if (exists) {
      toast.showError('Tag already exists')
      return
    }

    // Add the tag to the post
    setPost({
      ...post,
      tags: [...post.tags, { name: tag }]
    })
  }

  const handleDeleteTag = (tag) => {
    setPost({
      ...post,
      tags: post.tags.filter((ta) => ta.name !== tag.name)
    })
  }

  return (
    <aside className='min-h-screen min-w-72 m-2 p-2 sticky top-0 z-50 overflow-hidden flex flex-col gap-2 bg-gray-50 border-r shadow rounded-lg'>
      <Typography
        variant='h5'
        color='gray'
        className='w-full p-2 bg-gray-300 shadow rounded-lg uppercase'
      >
        Sidebar
      </Typography>

      <ul className='flex flex-col gap-2'>
        <li className='my-1 static z-10'>
          <Card className='w-full p-2 drop-shadow-sm'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='border-b border-gray-300 pb-2 mb-2'
            >
              Status
            </Typography>
            <div className='mb-2 flex gap-1'>
              <Select
                className='!border !border-gray-300 text-gray-900 focus:shadow-md shadow-gray-900/5 placeholder:text-gray-500 placeholder:opacity-100'
                labelProps={{
                  className: 'hidden'
                }}
                onChange={(value) => {
                  setPost({ ...post, status: value })
                }}
                value={post.status}
                disabled={
                  (roleName === 'SUBSCRIBER' && true) ||
                  (roleName === 'CONTRIBUTOR' && true) ||
                  (roleName === 'AUTHOR' && true) ||
                  false
                }
              >
                <Option key='published' value='published'>
                  Published
                </Option>
                <Option key='draft' value='draft'>
                  Draft
                </Option>
              </Select>
            </div>
          </Card>
        </li>

        <li className='my-1'>
          <Card className='w-full p-2 drop-shadow-sm'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='border-b border-gray-300 pb-2 mb-2'
            >
              Categories
            </Typography>
            <div className='mb-2 flex gap-1'>
              <Input
                type='text'
                placeholder='Category Name'
                className='!p-2 !border !border-gray-300 bg-white text-gray-900 shadow-none focus:shadow-md shadow-gray-900/5 placeholder:text-gray-500 placeholder:opacity-100'
                labelProps={{
                  className: 'hidden'
                }}
                containerProps={{ className: 'min-w-[100px]' }}
                onChange={(e) => setCategory(e.target.value)}
              />
              <IconButton
                variant='text'
                color='blue-gray'
                onClick={() => handleNewCategory(category)}
              >
                <PlusIcon width={20} />
              </IconButton>
            </div>
            <List className='min-w-full p-0'>
              {
                // Check if posts have categories
                post.categories &&
                  post.categories.map((category) => (
                    <ListItem key={category.name} className='p-1'>
                      {category.name}
                      <ListItemSuffix>
                        <IconButton
                          variant='text'
                          color='blue-gray'
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <TrashIcon width={20} />
                        </IconButton>
                      </ListItemSuffix>
                    </ListItem>
                  ))
              }
            </List>
          </Card>
        </li>

        <li className='my-1'>
          <Card className='w-full p-2 drop-shadow-sm'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='border-b border-gray-300 pb-2 mb-2'
            >
              Tags
            </Typography>
            <div className='mb-2 flex gap-1'>
              <Input
                type='text'
                placeholder='Tag Name'
                className='!p-2 !border !border-gray-300 bg-white text-gray-900 shadow-none focus:shadow-md shadow-gray-900/5 placeholder:text-gray-500 placeholder:opacity-100'
                labelProps={{
                  className: 'hidden'
                }}
                containerProps={{ className: 'min-w-[100px]' }}
                onChange={(e) => setTag(e.target.value)}
              />
              <IconButton
                variant='text'
                color='blue-gray'
                onClick={() => handleNewTag(tag)}
              >
                <PlusIcon width={20} />
              </IconButton>
            </div>
            <List className='min-w-full p-0'>
              {
                // Check if posts have tags
                post.tags &&
                  post.tags.map((tag) => (
                    <ListItem key={tag.name} className='p-1'>
                      {tag.name}
                      <ListItemSuffix>
                        <IconButton
                          variant='text'
                          color='blue-gray'
                          onClick={() => handleDeleteTag(tag)}
                        >
                          <TrashIcon width={20} />
                        </IconButton>
                      </ListItemSuffix>
                    </ListItem>
                  ))
              }
            </List>
          </Card>
        </li>

        <li className='my-1'>
          <Card className='w-full p-2 drop-shadow-sm z-10'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='border-b border-gray-300 pb-2 mb-2'
            >
              Author
            </Typography>
            <div className='mb-2 flex gap-1'>
              {loading ? (
                <Spinner />
              ) : (
                <Select
                  placeholder='Select author'
                  className='!border !border-gray-300 text-gray-900 focus:shadow-md shadow-gray-900/5 placeholder:text-gray-500 placeholder:opacity-100'
                  value={post.userId.toString()}
                  labelProps={{
                    className: 'hidden'
                  }}
                  onChange={(value) => {
                    setPost({ ...post, userId: parseInt(value) })
                  }}
                  disabled={
                    (roleName === 'SUBSCRIBER' && true) ||
                    (roleName === 'CONTRIBUTOR' && true) ||
                    (roleName === 'AUTHOR' && true) ||
                    false
                  }
                >
                  {authors.map((author) => (
                    <Option key={author.id} value={author.id.toString()}>
                      {author.id} {author.displayName}
                    </Option>
                  ))}
                </Select>
              )}
            </div>
          </Card>
        </li>

        <li className='my-1'>
          <EditPostThumbnail post={post} setPost={setPost} />
        </li>
      </ul>

      {/* <AdminAuthorSidebarCard expanded={expanded} /> */}
    </aside>
  )
}
