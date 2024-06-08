import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import {
  IconButton,
  Button,
  Tooltip,
  Typography,
  Dialog,
  Card,
  CardBody,
  Input,
  CardFooter
} from '@material-tailwind/react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import useAuth from '../../hooks/useAuth'
import useAlertToast from '../../hooks/useToast'
import tagService from '../../services/tagService'
import categoryService from '../../services/categoryService'

function EditButton({ url, setUrl, singleName, id, dataName, roleName }) {
  const { toast } = useAlertToast()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState(dataName)

  const handleOpen = () => setOpen(!open)

  const handleEdit = async () => {
    try {
      let response

      if (singleName === 'tag') {
        response = await tagService.updateTag({ id, name })
      } else if (singleName === 'category') {
        response = await categoryService.updateCategory({ id, name })
      } else {
        console.error('Invalid singleName')
        return
      }

      if (!response.ok) {
        console.error('Failed to update tag')
        return
      }

      setUrl({ ...url })
      toast.showSuccess('Tag updated successfully')
      handleOpen()
    } catch (error) {
      console.error(error)
      handleOpen()
      toast.showError('Failed to update tag')
    }
  }

  return (
    <>
      <Tooltip
        content='Edit'
        className='dark:text-gray-900 dark:bg-gray-100'
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 25 }
        }}
      >
        <IconButton
          variant='text'
          className='dark:hover:bg-blue-gray-800 dark:text-gray-200'
          disabled={roleName != 'ADMIN' && roleName != 'EDITOR'}
          onClick={handleOpen}
        >
          <PencilSquareIcon width={20} />
        </IconButton>
      </Tooltip>
      <Dialog
        size='xs'
        open={open}
        handler={handleOpen}
        className='bg-transparent shadow-none'
      >
        <Card className='mx-auto w-full max-w-[24rem] dark:bg-gray-800'>
          <CardBody className='flex flex-col gap-4'>
            <Typography
              variant='h4'
              color='blue-gray'
              className='dark:text-gray-200'
            >
              Edit
            </Typography>
            <Input
              label='Name'
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              className='dark:text-gray-200'
              size='lg'
            />
          </CardBody>
          <CardFooter className='pt-0'>
            <Button variant='gradient' onClick={handleEdit} fullWidth>
              Save
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  )
}

export default function TableAdminCatTag({
  data,
  url,
  setUrl,
  singleName,
  pluralName
}) {
  const { roleName } = useAuth()
  const { toast } = useAlertToast()

  return data.map(({ id, name, createdAt, updatedAt }, index) => {
    const isLast = index === data.length - 1
    const classes = isLast ? 'p-3' : 'p-3 border-b border-blue-gray-50'

    return (
      <tr key={name}>
        <td className={classes}>
          <div className='flex flex-col'>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal dark:text-gray-200'
            >
              {id}
            </Typography>
          </div>
        </td>
        <td className={classes}>
          <div className='flex flex-col'>
            <Typography
              variant='small'
              color='blue-gray'
              className='font-normal dark:text-gray-200'
            >
              {name}
            </Typography>
          </div>
        </td>
        <td className={classes}>
          <Typography
            variant='small'
            color='blue-gray'
            className='font-normal dark:text-gray-200'
          >
            {format(new Date(createdAt), 'MMM dd, yyyy')}
          </Typography>
        </td>
        <td className={classes}>
          <EditButton
            url={url}
            setUrl={setUrl}
            singleName={singleName}
            id={id}
            dataName={name}
            roleName={roleName}
          />
          <Tooltip
            content='Delete'
            className='dark:text-gray-900 dark:bg-gray-100'
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 }
            }}
          >
            <IconButton
              variant='text'
              className='dark:hover:bg-blue-gray-800 dark:text-gray-200'
              disabled={roleName != 'ADMIN' && roleName != 'EDITOR'}
              onClick={async () => {
                try {
                  console.log('singleName', singleName)
                  let response
                  if (singleName === 'tag') {
                    response = await tagService.deleteTag(id)
                  } else if (singleName === 'category') {
                    response = await categoryService.deleteCategory(id)
                  }

                  console.log('response', response)
                  if (!response.ok) {
                    console.error('Error deleting post', response)
                    toast.showError(
                      `Failed to delete, status code: ${response.statusCode}`
                    )
                  }

                  toast.showSuccess('Post deleted successfully')
                  setUrl({ ...url }) // Refresh the page
                } catch (error) {
                  console.error('Error deleting post', error)
                  toast.showError('Failed to delete post')
                }
              }}
            >
              <TrashIcon width={20} />
            </IconButton>
          </Tooltip>
        </td>
      </tr>
    )
  })
}
