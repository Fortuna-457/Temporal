import multer from 'multer'
import path from 'path'

// Allowed extensions
const filetypes = /jpeg|jpg|png|gif/

// Define file stogare configuration
const filestorageconfig = {
  destination: (req, file, cb) => {
    const uploadDir =
      file.fieldname === 'avatar' ? 'src/uploads/avatars' : 'src/uploads/posts'
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
}

// Check file type
const checkFileType = (file, cb) => {
  // Check the extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  // Check the mimetype
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images only!')
  }
}

// Create multer instance
const upload = multer({
  storage: multer.diskStorage(filestorageconfig),
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }
})

// Init upload avatar
export const uploadAvatar = upload.single('avatar')

// Init upload post thumbnail
export const uploadPostThumbnail = upload.single('thumbnail')
