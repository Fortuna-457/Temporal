import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../../../services/userService'
import useAlertToast from '../../../hooks/useToast'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Input,
  Select,
  Spinner,
  Textarea,
  Typography
} from '@material-tailwind/react'
import ProfilePictureCard from '../../../components/Cards/ProfilePictureCard'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import useAuth from '../../../hooks/useAuth'
import authService from '../../../services/authService'
import { useNavigate } from 'react-router-dom'

export default function EditUser() {
  const { id } = useParams()
  const { toast } = useAlertToast()
  const [user, setUser] = useState({
    id: 0,
    displayName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    biography: '',
    picture: '',
    roleId: 0
  })
  const [loading, setLoading] = useState(true)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const { roleName, userId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // check if the user is editing itself
    if (id == userId) {
      navigate('/wt-content/profile')
      return
    }

    async function fetchUser() {
      try {
        const response = await userService.getUserById(id)
        if (!response.ok) {
          console.log('Failed to get user')
          return
        }

        const user = response.body
        setUser(user)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
        toast.showError('Error getting user')
      }
    }

    fetchUser()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if any necessary field is empty
    if (!user.displayName || !user.username || !user.email) {
      toast.showError('Necessary fields are required')
      return
    }

    try {
      const response = await userService.updateUser(user, userId, roleName)
      console.log('response', response)
      if (!response.ok) {
        console.error(response.message || 'Error in request')
        toast.showError(response.message || 'Error updating user')
        return
      }

      // Reload the page
      window.location.reload()
      toast.showSuccess('User updated successfully')
    } catch (error) {
      console.error(error)
      toast.showError(error.message || 'Error updating user')
    }
  }
  return loading ? (
    <Spinner />
  ) : (
    <>
      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          className='m-0 p-3 rounded-b-none bg-gray-300 dark:bg-blue-gray-700 dark:text-gray-100 flex justify-between items-center'
        >
          <Typography variant='h3'>Edit user</Typography>
          <div className='flex gap-3'>
            <Button
              variant='outlined'
              className='dark:border-gray-200 dark:text-gray-200'
              onClick={() => navigate('/wt-content/users')}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </CardHeader>
        <CardBody className='flex justify-center items-center container mx-auto flex-auto bg-white dark:bg-blue-gray-900 dark:text-gray-100'>
          {loading ? (
            <Spinner />
          ) : (
            <form>
              <ProfilePictureCard user={user} setUser={setUser} />
              <div>
                <Typography
                  variant='h6'
                  className='uppercase font-bold text-sm mb-2'
                >
                  User Information
                </Typography>
                <div className='flex flex-wrap items-center'>
                  <div className='w-full lg:w-1/2 px-4 mb-6'>
                    <CustomInput
                      label={'Username'}
                      placeholder={'Username'}
                      name={'username'}
                      value={user.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='w-full lg:w-1/2 px-4 mb-6'>
                    <CustomInput
                      label={'Email'}
                      placeholder={'Email'}
                      name={'email'}
                      value={user.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='w-full lg:w-6/12 px-4 mb-6'>
                    <CustomInput
                      label={'Display Name'}
                      placeholder={'Display Name'}
                      name={'displayName'}
                      value={user.displayName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex items-center h-full w-full lg:w-6/12 px-4 mb-6'>
                    <div className='w-full'>
                      <label
                        className='block uppercase text-xs font-bold mb-2'
                        htmlFor='roleId'
                      >
                        Role
                      </label>
                      <Select
                        label={'Role'}
                        name={'roleId'}
                        onChange={(e) =>
                          handleInputChange({
                            target: { name: 'roleId', value: e }
                          })
                        }
                        value={user.roleId.toString()}
                        disabled={roleName !== 'ADMIN'}
                        className='!bg-gray-100 dark:!bg-blue-gray-800 text-gray-900 dark:text-gray-200'
                      >
                        <Option value='1'>Admin</Option>
                        <Option value='2'>Editor</Option>
                        <Option value='3'>Author</Option>
                        <Option value='4'>Contributor</Option>
                        <Option value='5'>Subscriber</Option>
                      </Select>
                    </div>
                  </div>
                  <div className='relative w-full lg:w-6/12 px-4 mb-6 lg:mb-0'>
                    <CustomInput
                      label={'Password'}
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder={'Your password'}
                      name={'password'}
                      value={user.password}
                      onChange={handleInputChange}
                    />
                    <IconButton
                      variant='text'
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      color={user.password ? 'gray' : 'blue-gray'}
                      className='!absolute right-5 bottom-0'
                    >
                      {passwordVisible ? (
                        <EyeIcon width={20} />
                      ) : (
                        <EyeSlashIcon width={20} />
                      )}
                    </IconButton>
                  </div>
                  <div className='relative flex justify-between w-full lg:w-6/12 px-4'>
                    <CustomInput
                      label={'Confirm Password'}
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      placeholder={'Repeat password'}
                      name={'confirmPassword'}
                      value={user.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <IconButton
                      variant='text'
                      onClick={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                      color={user.confirmPassword ? 'gray' : 'blue-gray'}
                      className='!absolute right-5 bottom-0'
                    >
                      {confirmPasswordVisible ? (
                        <EyeIcon width={20} />
                      ) : (
                        <EyeSlashIcon width={20} />
                      )}
                    </IconButton>
                  </div>
                </div>
              </div>

              <hr className='my-8 border-b-1  border-gray-400 dark:border-blue-gray-300' />

              <div>
                <Typography
                  variant='h6'
                  className='uppercase font-bold text-sm mb-2'
                >
                  About Me
                </Typography>
                <div className='flex flex-wrap'>
                  <div className='w-full lg:w-12/12 px-4'>
                    <div className='relative w-full mb-3'>
                      <Textarea
                        className='!border-0 !bg-gray-100 dark:!bg-blue-gray-800 placeholder-gray-500 text-gray-600 dark:text-gray-200 text-sm shadow-md shadow-gray-300 dark:shadow-gray-900 focus:shadow-xl'
                        labelProps={{
                          className: 'before:content-none after:content-none'
                        }}
                        placeholder='Your description'
                        name='biography'
                        defaultValue={user.biography}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </>
  )
}

function CustomInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text'
}) {
  return (
    <div className='relative w-full'>
      <label className='block uppercase text-xs font-bold mb-2' htmlFor={name}>
        {label}
      </label>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        className='!bg-gray-100 dark:!bg-blue-gray-800 !border-0 p-3 placeholder-gray-500 text-gray-600 dark:text-gray-200 text-sm shadow-md shadow-gray-300 dark:shadow-gray-900 focus:shadow-xl w-full ease-linear transition-all duration-150'
        labelProps={{
          className: 'before:content-none after:content-none'
        }}
        defaultValue={value}
        onChange={onChange}
      />
    </div>
  )
}
