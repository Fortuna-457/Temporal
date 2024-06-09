import React from 'react'
import { Input } from '@material-tailwind/react'

export default function CustomLoginInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = ''
}) {
  return (
    <div className='relative w-full'>
      <Input
        label={label}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`p-3 placeholder:text-gray-700 text-gray-700 dark:text-gray-200 text-sm shadow shadow-gray-300 dark:shadow-gray-800 focus:shadow-xl w-full ease-linear transition-all duration-150  ${className}`}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
