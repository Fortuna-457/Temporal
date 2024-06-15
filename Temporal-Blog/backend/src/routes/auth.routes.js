import express from 'express'
import {
  login,
  refreshToken,
  register
} from '../controllers/auth.controller.js'
import { checkToken } from '../middlewares/auth.middlewares.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/refresh-token', checkToken, refreshToken)

export default router
