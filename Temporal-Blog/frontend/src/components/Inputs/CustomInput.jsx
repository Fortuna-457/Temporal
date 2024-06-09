import { Input } from '@material-tailwind/react'
import React from 'react'

export default function CustomInput({
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
      <label className='block uppercase text-xs font-bold mb-2' htmlFor={name}>
        {label}
      </label>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`!border-0 p-3 placeholder-gray-500 text-gray-600 text-sm shadow-md shadow-gray-300 focus:shadow-xl w-full ease-linear transition-all duration-150 ${className}`}
        labelProps={{
          className: 'before:content-none after:content-none'
        }}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
