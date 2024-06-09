import express from 'express'
import {
  createPost,
  getPostById,
  deletePost,
  getAllPosts,
  updatePost
} from '../controllers/post.controller.js'
import { checkToken } from '../middlewares/auth.middlewares.js'
import { checkRole } from '../middlewares/role.middlewares.js'

const router = express.Router()

router.get('/', getAllPosts)
router.get('/:postId', getPostById)
router.post(
  '/',
  [checkToken, checkRole(['CONTRIBUTOR', 'AUTHOR', 'EDITOR', 'ADMIN'])],
  createPost
)
router.put(
  '/:postId',
  [checkToken, checkRole(['CONTRIBUTOR', 'AUTHOR', 'EDITOR', 'ADMIN'])],
  updatePost
)
router.delete(
  '/:postId',
  [checkToken, checkRole(['AUTHOR', 'EDITOR', 'ADMIN'])],
  deletePost
)

export default router
