import express from 'express'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  getPosts
} from '../controllers/user.controller.js'
import { checkToken } from '../middlewares/auth.middlewares.js'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:userId', getUserById)
router.get('/:id/posts', getPosts)
router.post('/', createUser)
router.put('/:userId', checkToken, updateUser)
router.delete('/:userId', checkToken, deleteUser)

export default router
