import React from 'react'

export default function EditSidebarItemCard({ title, array, callbackfn }) {
  return (
    <div className={`my-4 ${title}`}>
      <h4 className='text-lg text-white'>{title}</h4>
      <ul className='flex justify-start items-start flex-wrap align-top gap-2 bg-gray-800 p-2 rounded '>
        {array.map(callbackfn)}
      </ul>
    </div>
  )
}
