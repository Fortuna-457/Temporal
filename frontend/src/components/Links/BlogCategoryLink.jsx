import React, { useEffect, useState } from 'react'
import categoryService from '../../services/categoryService'
import { Link } from 'react-router-dom'
import { Button } from '@material-tailwind/react'

export default function BlogCategoryLink({ categoryId }) {
  const [category, setCategory] = useState({})

  useEffect(() => {
    async function getCategory() {
      try {
        const response = await categoryService.getCategoryById(categoryId)

        if (!response.ok) {
          console.error('Failed to get category')
          return
        }

        const category = response.body
        setCategory(category)
      } catch (error) {
        console.error(error)
      }
    }

    getCategory()
  }, [categoryId])

  return (
    <Link to={`/categories/${category.id}`}>
      <Button size='sm'>{category.name || 'Category'}</Button>
    </Link>
  )
}
