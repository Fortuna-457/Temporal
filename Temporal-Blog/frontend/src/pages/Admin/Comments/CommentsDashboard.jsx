import React, { useEffect, useState } from 'react'
import commentService from '../../../services/commentService'
import useAlertToast from '../../../hooks/useToast'
import useAuth from '../../../hooks/useAuth'
import {
  Button,
  Card,
  CardHeader,
  Input,
  Tabs,
  TabsHeader,
  Tab,
  Typography,
  CardBody,
  Spinner
} from '@material-tailwind/react'
import { Link } from 'react-router-dom'
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import TableAdminComments from '../../../components/Tables/TableAdminComments'

export default function CommentsDashboard() {
  const { toast } = useAlertToast()
  const { roleName } = useAuth()

  const [comments, setComments] = useState([])

  const [url, setUrl] = useState({
    page: null,
    order: null,
    limit: null
  })

  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await commentService.getAllComments(url)

        if (!response.ok) {
          console.log('Failed to get comments')
          return
        }

        const comments = response.body.comments
        setComments(comments)
        setPagination(response.body.pagination)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
        toast.showError('Error getting comments')
      }
    }

    fetchComments()
  }, [url])

  const handleTabClick = (value) => {
    setLoading(true)
    setUrl({ ...url, status: value })
  }

  return (
    <Card className='w-full dark:bg-blue-gray-900'>
      <CardHeader
        floated={false}
        shadow={false}
        className='p-5 m-0 rounded-b-none bg-gray-300 dark:bg-blue-gray-700 dark:text-gray-100'
      >
        <div className='mb-8 flex items-center justify-between gap-8'>
          <div>
            <Typography
              variant='h3'
              className='text-blue-gray-900 dark:text-gray-200'
            >
              Comments list
            </Typography>
            <Typography
              color='gray'
              className='mt-1 font-normal text-blue-gray-900 dark:text-gray-200'
            >
              See and manage all comments
            </Typography>
          </div>
          <div className='flex shrink-0 flex-col gap-2 sm:flex-row '>
            <Button size='sm' disabled={roleName === 'SUBSCRIBER'}>
              <Link
                to='/wt-content/posts/create'
                className='flex items-center gap-3'
              >
                <PlusIcon strokeWidth={2} className='h-4 w-4' /> Add comment
              </Link>
            </Button>
          </div>
        </div>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <Tabs value='all' className='w-full md:w-max'>
            <TabsHeader>
              <Tab
                value='all'
                className='px-5'
                onClick={() => handleTabClick('all')}
              >
                All
              </Tab>
              <Tab
                value='approved'
                className='px-5'
                onClick={() => handleTabClick('approved')}
              >
                Approved
              </Tab>
              <Tab
                value='draft'
                className='px-5'
                onClick={() => handleTabClick('pending')}
              >
                Pending
              </Tab>
            </TabsHeader>
          </Tabs>
          <div className='w-full md:w-72'>
            <Input
              label='Search'
              icon={<MagnifyingGlassIcon className='h-5 w-5' />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className='overflow-scroll px-0'>
        <table className='mt-0 w-full min-w-max table-auto text-left'>
          <thead>
            <tr>
              <th className='border-y border-blue-gray-100 dark:bg-blue-gray-600 p-4'>
                <Typography
                  variant='small'
                  color='blue-gray'
                  className='font-normal leading-none opacity-70 dark:text-white'
                >
                  Id
                </Typography>
              </th>
              <th className='border-y border-blue-gray-100 dark:bg-blue-gray-600  p-4'>
                <Typography
                  variant='small'
                  color='blue-gray'
                  className='flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white'
                >
                  Content
                </Typography>
              </th>
              <th className='border-y border-blue-gray-100 dark:bg-blue-gray-600  p-4'>
                <Typography
                  variant='small'
                  color='blue-gray'
                  className='flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white'
                >
                  Post Id
                </Typography>
              </th>
              <th className='border-y border-blue-gray-100 dark:bg-blue-gray-600  p-4'>
                <Typography
                  variant='small'
                  color='blue-gray'
                  className='font-normal leading-none opacity-70 dark:text-white'
                >
                  Author
                </Typography>
              </th>
              <th
                className='cursor-pointer border-y border-blue-gray-100 dark:bg-blue-gray-600  p-4 transition-colors hover:bg-blue-gray-50'
                onClick={() => {
                  const urlDate = url.order === 'DESC' ? 'ASC' : 'DESC'
                  setUrl({ ...url, order: urlDate })
                }}
              >
                <Typography
                  variant='small'
                  color='blue-gray'
                  className='flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white'
                >
                  Date
                  <ChevronUpDownIcon strokeWidth={2} className='h-4 w-4' />
                </Typography>
              </th>
              <th className='border-y border-blue-gray-100 dark:bg-blue-gray-600  p-4'>
                <Typography
                  variant='small'
                  color='blue-gray'
                  className='font-normal leading-none opacity-70 dark:text-white'
                >
                  Status
                </Typography>
              </th>
              <th className='border-y border-blue-gray-100 dark:bg-blue-gray-600  p-4'>
                <Typography
                  variant='small'
                  color='blue-gray'
                  className='font-normal leading-none opacity-70 dark:text-white'
                >
                  Actions
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className='dark:text-gray-200'>
            {loading ? (
              <tr>
                <td colSpan={6} className='h-20'>
                  <Spinner className='mx-auto' />
                </td>
              </tr>
            ) : (
              <TableAdminComments
                comments={comments}
                url={url}
                setUrl={setUrl}
              />
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  )
}
