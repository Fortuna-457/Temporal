import { PencilSquareIcon } from '@heroicons/react/24/outline'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  IconButton,
  Typography
} from '@material-tailwind/react'
import React, { useState } from 'react'
import { useAvatarPreview } from '../../hooks/useImagePreview'
import useAlertToast from '../../hooks/useToast'
import imageService from '../../services/imageService'
import CustomInput from '../Inputs/CustomInput'

export default function ProfilePictureCard({ user, setUser }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const preview = useAvatarPreview(user.picture)
  const { toast } = useAlertToast()

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
      const newFile = renameFile(file, `${user.username}`)

      // Send the file to the server
      const formData = new FormData()
      formData.append('avatar', newFile)
      const response = await imageService.uploadAvatar(formData)

      if (response.ok) {
        setOpen(false)

        // Update the user object
        setUser({ ...user, picture: newFile.name })

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

    // Reconstruct the filename with the extension
    const finalName = `${newName}.${extension}`

    // Create a new file object with the original file's content and the new name
    return new File([originalFile], finalName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified
    })
  }

  return (
    <div className='flex justify-center mb-8'>
      <div className='relative'>
        <img
          className='h-80 w-80 rounded-full object-cover object-center shadow-lg shadow-gray-300 dark:shadow-gray-900'
          src={preview}
          alt='nature image'
        />
        <IconButton
          variant='text'
          className='!absolute bottom-0 right-0 dark:hover:bg-blue-gray-800 dark:text-gray-200'
          onClick={handleOpen}
        >
          <PencilSquareIcon width={20} />
        </IconButton>
        <Dialog
          open={open}
          handler={handleOpen}
          className='bg-transparent shadow-none'
        >
          <DialogBody className='bg-transparent'>
            <Card className='mx-auto w-full max-w-[24rem]'>
              <CardBody className='flex flex-col items-center gap-4'>
                <Typography variant='h4'>Change Profile Picture</Typography>
                <CustomInput
                  name='picture'
                  type='file'
                  onChange={handleFileChange}
                />
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
      </div>
    </div>
  )
}
