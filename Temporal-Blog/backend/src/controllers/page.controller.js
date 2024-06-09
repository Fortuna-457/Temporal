import { Page } from '../models/page.model.js'
import {
  errorHandler,
  successHandler
} from '../middlewares/response.middlewares.js'

/**
 * Get all pages from database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getAllPages = async (req, res) => {
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    order = 'DESC'
  } = req.query
  const offset = (page - 1) * limit

  try {
    // Get all pages from DB
    const { count, rows: pages } = await Page.findAndCountAll({
      offset,
      limit: parseInt(limit),
      order: [['created_at', order]]
    })

    // Check if pages were found
    if (!pages || pages.length === 0) {
      // Return error
      return errorHandler(
        { statusCode: 404, message: 'No pages found' },
        req,
        res
      )
    }

    // Send pages in response as JSON
    return successHandler(
      {
        pages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count
        }
      },
      req,
      res
    )
  } catch (error) {
    return errorHandler(
      { message: error.message, details: 'Internal Server Error' },
      req,
      res
    )
  }
}

/**
 * Get page from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getPageById = async (req, res) => {
  // Get page ID from request params
  const { pageId } = req.params // Same as: pageId = req.params.pageId;

  // Get page by ID from DB
  Page.findByPk(pageId)
    .then((page) =>
      !page
        ? errorHandler({ statusCode: 404, message: 'No page found' }, req, res)
        : successHandler(page, req, res)
    )
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    )
}

/**
 * Create new page in database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const createPage = async (req, res) => {
  // Destructure request body to get values
  const { name } = req.body

  // Validate the fields
  if (!Page.isPageFieldsValid(name)) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Insert page in DB
  Page.create({ name })
    .then((newPage) => successHandler(newPage, req, res)) // Send page to response as JSON
    .catch((error) =>
      // Send error message
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    )
}

/**
 * Update a page in database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const updatePage = async (req, res) => {
  // Get page ID from request params
  const { pageId } = req.params

  // Destructure request body to get values
  const { name } = req.body

  // Validate the fields
  if (!Page.isPageFieldsValid(name)) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Update page
  Page.findByPk(pageId)
    .then((page) => {
      // Check if page exists
      if (!page) {
        return errorHandler(
          { statusCode: 404, message: 'No page found' },
          req,
          res
        )
      }

      // Update page data
      page.set({ name })

      // Save it in DB
      page.save().then((updatedPage) => successHandler(updatedPage, req, res))
    })
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    )
}

/**
 * Delete a page from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const deletePage = async (req, res) => {
  // Get page ID from params
  const { pageId } = req.params

  // Delete page from DB
  Page.destroy({ where: { id: pageId } })
    .then((num) => {
      if (num === 0) {
        // Send error message
        errorHandler({ statusCode: 404, message: 'No page found' }, req, res)
      } else {
        // Send success message
        successHandler('Page deleted successfully', req, res)
      }
    })
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    )
}
