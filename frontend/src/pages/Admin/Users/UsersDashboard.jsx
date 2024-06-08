import TableAdminUsers from '../../../components/Tables/TableAdminUsers'
import DefaultPagination from '../../../components/Pagination/DefaultPagination'
import useAuth from '../../../hooks/useAuth'
import useAlertToast from '../../../hooks/useToast'
import userService from '../../../services/userService'
import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spinner,
  Typography
} from '@material-tailwind/react'
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function UsersDashboard() {
  const { toast } = useAlertToast()
  const { roleName } = useAuth()

  const [users, setUsers] = useState([])
  const [url, setUrl] = useState({
    page: null,
    order: null,
    limit: null
  })

  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await userService.getAllUsers(url)

        if (!response.ok) {
          console.log('Failed to get users')
          return
        }

        const users = response.body.users
        setUsers(users)
        setPagination(response.body.pagination)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
        toast.showError('Error getting users')
      }
    }

    fetchUsers()
  }, [url])

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
              Users List
            </Typography>
            <Typography
              color='gray'
              className='mt-1 font-normal text-blue-gray-900 dark:text-gray-200'
            >
              See and manage all users
            </Typography>
          </div>
          <div className='flex shrink-0 flex-col gap-2 sm:flex-row '>
            <Button size='sm' disabled={roleName === 'SUBSCRIBER'}>
              <Link
                to='/wt-content/users/create'
                className='flex items-center gap-3'
              >
                <PlusIcon strokeWidth={2} className='h-4 w-4' /> Add user
              </Link>
            </Button>
          </div>
        </div>
        <div className='flex flex-col items-center justify-end gap-4 md:flex-row'>
          <div className='w-full md:w-72'>
            <Input
              label='Search'
              icon={<MagnifyingGlassIcon className='h-5 w-5' />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className='overflow-scroll px-0'>
        <table className='max-w-3xl  mx-auto mt-0 w-full min-w-max table-auto text-left'>
          <thead>
            <tr>
              <th className='border-y border-blue-gray-100 dark:bg-blue-gray-600  p-4'>
                <Typography
                  variant='small'
                  color='blue-gray'
                  className='flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white'
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
                  Username
                </Typography>
              </th>
              <th className='border-y border-blue-gray-100 dark:bg-blue-gray-600  p-4'>
                <Typography
                  variant='small'
                  color='blue-gray'
                  className='flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white'
                >
                  Display Name
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
                  Actions
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className='dark:text-gray-200'>
            {loading ? (
              <tr>
                <td colSpan={4} className='h-20'>
                  <Spinner className='mx-auto' />
                </td>
              </tr>
            ) : (
              <TableAdminUsers users={users} url={url} setUrl={setUrl} />
            )}
          </tbody>
        </table>
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
