import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { checkToken } from '../middlewares/auth.middlewares.js'
import {
  uploadAvatar,
  uploadPostThumbnail
} from '../middlewares/multer.middlewares.js'
import {
  errorHandler,
  successHandler
} from '../middlewares/response.middlewares.js'

const router = express.Router()

// Get the directory path of the current file
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Construct the path to the uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads')

// Upload avatar
router.post('/upload/avatar', [checkToken, uploadAvatar], (req, res) => {
  if (!req.file) {
    // Return error
    return errorHandler(
      { statusCode: 404, message: 'No file uploaded' },
      req,
      res
    )
  }

  return successHandler(req.file.filename, req, res)
})

// Serve uploaded avatars
router.use('/avatars', express.static(path.join(uploadsDir, 'avatars')))

// Upload post thumbnail
router.post(
  '/upload/post-thumbnail',
  [checkToken, uploadPostThumbnail],
  (req, res) => {
    if (!req.file) {
      // Return error
      return errorHandler(
        { statusCode: 404, message: 'No file uploaded' },
        req,
        res
      )
    }

    return successHandler(req.file.filename, req, res)
  }
)

// Serve uploaded post thumbnails
router.use('/post-thumbnails', express.static(path.join(uploadsDir, 'posts')))

export default router
