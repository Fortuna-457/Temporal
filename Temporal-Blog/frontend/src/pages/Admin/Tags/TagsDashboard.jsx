import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  Input,
  Spinner,
  Typography
} from '@material-tailwind/react'
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import useAlertToast from '../../../hooks/useToast'
import useAuth from '../../../hooks/useAuth'
import tagService from '../../../services/tagService'
import DefaultPagination from '../../../components/Pagination/DefaultPagination'
import TableAdminCatTag from '../../../components/Tables/TableAdminCatTag'

function CreateTagButton({ roleName, url, setUrl }) {
  const { toast } = useAlertToast()
  const [open, setOpen] = React.useState(false)
  const [tagName, setTagName] = React.useState('')

  const handleOpen = () => setOpen(!open)

  const handleCreateTag = async () => {
    if (!tagName) {
      toast.showError('Tag name is required')
      return
    }

    if (roleName === 'SUBSCRIBER') {
      toast.showError('You are not allowed to create tags')
      return
    }

    try {
      const response = await tagService.createTag({ name: tagName })

      if (!response.ok) {
        console.log('Failed to create tag')
        return
      }

      setUrl({ ...url })
      toast.showSuccess('Tag created successfully')
      handleOpen()
      setTagName('')
    } catch (error) {
      console.error(error)
      handleOpen()
    }
  }

  return (
    <>
      <Button
        size='sm'
        disabled={roleName === 'SUBSCRIBER'}
        className='flex items-center gap-3'
        onClick={handleOpen}
      >
        <PlusIcon strokeWidth={2} className='h-4 w-4' />
        Add Tag
      </Button>
      <Dialog
        size='xs'
        open={open}
        handler={handleOpen}
        className='bg-transparent shadow-none'
      >
        <Card className='mx-auto w-full max-w-[24rem]'>
          <CardBody className='flex flex-col gap-4'>
            <Typography variant='h4' color='blue-gray'>
              Create Tag
            </Typography>
            <Input
              label='Name'
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              size='lg'
            />
          </CardBody>
          <CardFooter className='pt-0'>
            <Button variant='gradient' onClick={handleCreateTag} fullWidth>
              Create
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  )
}

export default function TagsDashboard() {
  const { toast } = useAlertToast()
  const { roleName } = useAuth()

  const [tags, setTags] = useState([])
  const [url, setUrl] = useState({
    page: null,
    order: null,
    limit: null
  })

  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await tagService.getAllTags(url)

        if (!response.ok) {
          console.log('Failed to get tags')
          return
        }

        const tags = response.body.tags
        setTags(tags)
        setPagination(response.body.pagination)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
        toast.showError('Error getting tags')
      }
    }

    fetchTags()
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
              Tags list
            </Typography>
            <Typography
              color='gray'
              className='mt-1 font-normal text-blue-gray-900 dark:text-gray-200'
            >
              See and manage all tags
            </Typography>
          </div>
          <div className='flex shrink-0 flex-col gap-2 sm:flex-row '>
            <CreateTagButton url={url} setUrl={setUrl} roleName={roleName} />
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
                  Title
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
              <TableAdminCatTag
                data={tags}
                url={url}
                setUrl={setUrl}
                singleName={'tag'}
                pluralName={'tags'}
              />
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
