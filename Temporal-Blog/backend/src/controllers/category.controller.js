import { Category } from '../models/category.model.js'
import { Comment } from '../models/comment.model.js'
import { Post } from '../models/post.model.js'
import { Tag } from '../models/tag.model.js'
import { User } from '../models/user.model.js'
import { formatCategoryTag, formatPost } from '../utils/utils.js'
import {
  errorHandler,
  successHandler
} from '../middlewares/response.middlewares.js'

/**
 * Get all categories from database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getAllCategories = async (req, res) => {
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    order = 'DESC'
  } = req.query
  const offset = (page - 1) * limit

  try {
    // Get all categories from DB
    const { count, rows: categories } = await Category.findAndCountAll({
      offset,
      limit: parseInt(limit),
      order: [['created_at', order]]
    })

    // Check if categories were found
    if (!categories || !categories.length) {
      return errorHandler(
        { statusCode: 404, message: 'No categories found' },
        req,
        res
      )
    }

    // Format response as JSON
    const formattedCategories = categories.map(formatCategoryTag)

    // Send categories in response as JSON
    return successHandler(
      {
        categories: formattedCategories,
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
 * Get category from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getCategoryById = async (req, res) => {
  // Get category ID from request params
  const { categoryId } = req.params // Same as: categoryId = req.params.categoryId;

  // Get category by ID from DB
  Category.findByPk(categoryId)
    .then((category) =>
      !category
        ? errorHandler(
            { statusCode: 404, message: 'No category found' },
            req,
            res
          )
        : successHandler(formatCategoryTag(category), req, res)
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
 * Create new category in database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const createCategory = async (req, res) => {
  // Destructure request body to get values
  const { name } = req.body

  // Validate the fields
  if (!Category.isCategoryFieldsValid(name)) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Insert category in DB
  Category.create({ name })
    .then((newCategory) =>
      successHandler(formatCategoryTag(newCategory), req, res)
    ) // Send category to response as JSON
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    ) // Send error message
}

/**
 * Update a category in database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const updateCategory = async (req, res) => {
  // Get category ID from request params
  const { categoryId } = req.params

  // Destructure request body to get values
  const { name } = req.body

  // Validate the fields
  if (!Category.isCategoryFieldsValid(name)) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Update category
  Category.findByPk(categoryId)
    .then((category) => {
      // Check if category exists
      if (!category) {
        return errorHandler(
          { statusCode: 404, message: 'No category found' },
          req,
          res
        )
      }

      // Update category data
      category.set({ name })

      // Save it in DB
      category
        .save()
        .then((updatedCategory) =>
          successHandler(formatCategoryTag(updatedCategory), req, res)
        )
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
 * Delete a category from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const deleteCategory = async (req, res) => {
  // Get category ID from params
  const { categoryId } = req.params

  // Delete category from DB
  Category.destroy({ where: { id: categoryId } })
    .then((num) => {
      if (num === 0) {
        // Send error message
        return errorHandler(
          { statusCode: 404, message: 'No category found' },
          req,
          res
        )
      } else {
        // Send success message
        return successHandler('Category deleted successfully', req, res)
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

/**
 * Get posts from database by categories
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getPosts = async (req, res) => {
  // Get category from request params
  const { id } = req.params

  // Get query params
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    order = 'DESC'
  } = req.query
  const offset = (page - 1) * limit

  try {
    const count = await Post.count({
      include: [
        {
          model: Category,
          through: {
            where: {
              category_id: id
            }
          },
          required: true
        }
      ]
    })

    const posts = await Post.findAll({
      include: [
        {
          model: Category,
          through: {
            where: {
              category_id: id
            }
          },
          required: true
        },
        { model: Tag },
        { model: User },
        { model: Comment }
      ],
      offset,
      limit: parseInt(limit),
      order: [['created_at', order]]
    })

    // Check if posts were found
    if (!posts || posts.length === 0) {
      // Return error
      return errorHandler(
        { statusCode: 404, message: 'No posts found' },
        req,
        res
      )
    }

    // Format response as JSON
    const formattedPosts = posts.map(formatPost)

    // Send post in response as JSON
    return successHandler(
      {
        posts: formattedPosts,
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
