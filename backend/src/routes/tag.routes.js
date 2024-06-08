import express from 'express'
import {
  createTag,
  deleteTag,
  getAllTags,
  getPosts,
  getTagById,
  updateTag
} from '../controllers/tag.controller.js'
import { checkToken } from '../middlewares/auth.middlewares.js'
import { checkRole } from '../middlewares/role.middlewares.js'

const router = express.Router()

router.get('/', getAllTags)
router.get('/:tagId', getTagById)
router.get('/:id/posts', getPosts)
router.post(
  '/',
  [checkToken, checkRole(['CONTRIBUTOR', 'AUTHOR', 'EDITOR', 'ADMIN'])],
  createTag
)
router.put('/:tagId', [checkToken, checkRole(['EDITOR', 'ADMIN'])], updateTag)
router.delete(
  '/:tagId',
  [checkToken, checkRole(['EDITOR', 'ADMIN'])],
  deleteTag
)

export default router
