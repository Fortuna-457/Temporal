import React, { useState } from 'react'
import CustomLoginInput from './CustomLoginInput'
import { IconButton } from '@material-tailwind/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function CustomPasswordInput({ label, name, value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className='relative flex justify-between w-full'>
      <CustomLoginInput
        label={label}
        type={visible ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
      />
      <IconButton
        variant='text'
        onClick={() => setVisible(!visible)}
        color={value ? 'gray' : 'blue-gray'}
        className='!absolute right-0 bottom-0 dark:hover:bg-gray-700 dark:text-gray-200'
      >
        {visible ? <EyeIcon width={20} /> : <EyeSlashIcon width={20} />}
      </IconButton>
    </div>
  )
}
