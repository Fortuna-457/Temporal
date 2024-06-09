import express from 'express'
import {
  getAllPages,
  createPage,
  updatePage,
  deletePage,
  getPageById
} from '../controllers/page.controller.js'

const router = express.Router()

router.get('/', getAllPages)
router.get('/:pageId', getPageById)
router.post('/', createPage)
router.put('/:pageId', updatePage)
router.delete('/:pageId', deletePage)
export default router
