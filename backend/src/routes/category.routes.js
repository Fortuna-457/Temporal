import express from 'express'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getPosts
} from '../controllers/category.controller.js'
import { checkToken } from '../middlewares/auth.middlewares.js'
import { checkRole } from '../middlewares/role.middlewares.js'

const router = express.Router()

router.get('/', getAllCategories)
router.get('/:categoryId', getCategoryById)
router.get('/:id/posts', getPosts)
router.post(
  '/',
  [checkToken, checkRole(['AUTHOR', 'EDITOR', 'ADMIN'])],
  createCategory
)
router.put(
  '/:categoryId',
  [checkToken, checkRole(['AUTHOR', 'EDITOR', 'ADMIN'])],
  updateCategory
)
router.delete(
  '/:categoryId',
  [checkToken, checkRole(['EDITOR', 'ADMIN'])],
  deleteCategory
)

export default router
