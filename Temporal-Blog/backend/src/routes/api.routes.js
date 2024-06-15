import express from 'express'
import categoryRoutes from './category.routes.js'
import tagRoutes from './tag.routes.js'
import postRoutes from './post.routes.js'
import pageRoutes from './pages.routes.js'
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'
import commentRoutes from './comment.routes.js'
import imagesRoutes from './images.routes.js'

import { checkToken } from '../middlewares/auth.middlewares.js'

const router = express.Router()

router.use('/users', userRoutes)
router.use('/categories', categoryRoutes)
router.use('/tags', tagRoutes)
router.use('/posts', postRoutes)
router.use('/pages', checkToken, pageRoutes) // Pending
router.use('/comments', commentRoutes)
router.use('/images', imagesRoutes)
router.use('/', authRoutes)

export default router
