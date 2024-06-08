import React, { useState } from 'react'

export default function CategorySelector({ categories, postCategories }) {
  const [selectedCategories, setSelectedCategories] = useState([])

  const handleChange = (categoryId) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId]
    )
  }
  return (
    <div className=''>
      <h3 className='text-xl text-white mb-3'>Categories</h3>
      <ul className='flex flex-col justify-start align-top items-start gap-2 bg-gray-700 p-2 rounded '>
        {categories.map((category) => {
          {
            console.log(category)
          }
          return (
            <li className='flex' key={category.id}>
              <input
                type='checkbox'
                id={`category-${category.id}`}
                name={category.id}
                value={category.id}
                className='peer hidden'
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleChange(category.id)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className='select-none cursor-pointer rounded border border-gray-200
py-2 px-3 text-sm font-semibold text-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-gray-200 peer-checked:text-gray-900 peer-checked:border-gray-200 '
              >
                {category.name}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
