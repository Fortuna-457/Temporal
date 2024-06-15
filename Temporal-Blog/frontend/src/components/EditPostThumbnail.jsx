import { useState, useEffect } from 'react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import useAlertToast from '../hooks/useToast'
import imageService from '../services/imageService'
import defaultImage from '../assets/img/default-image.png'
import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  IconButton,
  Typography
} from '@material-tailwind/react'

export default function EditPostThumbnail({ post, setPost }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const { toast } = useAlertToast()

  useEffect(() => {
    if (post.thumbnail) {
      if (post.thumbnail.startsWith('http')) {
        setPreview(post.thumbnail)
      } else {
        setPreview(
          `${import.meta.env.VITE_API_BASE_URL}/images/post-thumbnails/${
            post.thumbnail
          }`
        )
      }
    } else {
      setPreview(defaultImage)
    }
  }, [post.thumbnail])

  const handleOpen = () => {
    setOpen((cur) => !cur)
  }

  const handleFileChange = (e) => {
    try {
      const uploadedFile = e.target.files[0]
      if (!uploadedFile) {
        console.log('No file selected')
        return
      }

      // Update the state
      setFile(uploadedFile)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      console.log('No file selected')
      return
    }

    try {
      // Rename the file
      const newFile = renameFile(file, `post-${post.id}-thumbnail`)
      // Send the file to the server
      const formData = new FormData()
      formData.append('thumbnail', newFile)

      const response = await imageService.uploadThumbnail(formData)

      if (response.ok) {
        setOpen(false)

        // Update the post object
        setPost({ ...post, thumbnail: newFile.name })

        // Update the preview

        setPreview(URL.createObjectURL(newFile))

        // Show a success message
        toast.showSuccess('File uploaded successfully')
      } else {
        setOpen(false)
        toast.showError('Error uploading file')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renameFile = (originalFile, newName) => {
    // Extract the file extension
    const extension = originalFile.name.split('.').pop()

    // Create a new file object
    const newFile = new File([originalFile], `${newName}.${extension}`, {
      type: originalFile.type
    })

    return newFile
  }

  return (
    <Card className='w-full p-2 drop-shadow-sm'>
      <div className='flex justify-between items-center pb-2 mb-2 border-b border-gray-300 '>
        <Typography variant='h5' color='blue-gray' className=''>
          Thumbnail
        </Typography>
        <IconButton variant='text' onClick={handleOpen}>
          <PencilSquareIcon width={20} />
        </IconButton>
      </div>
      <div className='mb-2 flex gap-1'>
        <img
          className='h-auto max-h-32 w-full rounded-lg object-cover object-center'
          src={preview}
          alt='nature image'
        />
      </div>
      <Dialog
        open={open}
        handler={handleOpen}
        className='bg-transparent shadow-none'
      >
        <DialogBody className='bg-transparent'>
          <Card className='mx-auto w-full max-w-[24rem]'>
            <CardBody className='flex flex-col items-center gap-4'>
              <Typography variant='h4'>Change Thumbnail</Typography>
              <input name='picture' type='file' onChange={handleFileChange} />
              <div className='flex gap-4'>
                <Button variant='outlined' onClick={handleOpen}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>Upload</Button>
              </div>
            </CardBody>
          </Card>
        </DialogBody>
      </Dialog>
    </Card>
  )
}
