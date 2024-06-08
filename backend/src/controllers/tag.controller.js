import { Tag } from '../models/tag.model.js'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'
import { Category } from '../models/category.model.js'
import { formatCategoryTag, formatPost } from '../utils/utils.js'
import { Comment } from '../models/comment.model.js'
import {
  errorHandler,
  successHandler
} from '../middlewares/response.middlewares.js'

/**
 * Get all tags from database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getAllTags = async (req, res) => {
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    order = 'DESC'
  } = req.query
  const offset = (page - 1) * limit

  try {
    // Get the total count of tags
    const { count, rows: tags } = await Tag.findAndCountAll({
      offset,
      limit: parseInt(limit),
      order: [['created_at', order]]
    })

    // Check if tags were found
    if (!tags || !tags.length) {
      return errorHandler(
        { statusCode: 404, message: 'No tags found' },
        req,
        res
      )
    }

    // Format response as JSON
    const formattedTags = tags.map(formatCategoryTag)
    // Send tags in response as JSON
    return successHandler(
      {
        tags: formattedTags,
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
 * Get tag from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getTagById = async (req, res) => {
  // Get tag ID from request params
  const { tagId } = req.params // Same as: tagId = req.params.tagId;

  // Get tag by ID from DB
  Tag.findByPk(tagId)
    .then((tag) =>
      !tag
        ? errorHandler({ statusCode: 404, message: 'No tag found' }, req, res)
        : successHandler(formatCategoryTag(tag), req, res)
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
 * Create new tag in database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const createTag = async (req, res) => {
  // Destructure request body to get values
  const { name } = req.body

  // Validate the fields
  if (!Tag.isTagFieldsValid(name)) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Insert tag in DB
  Tag.create({ name })
    .then((newTag) => successHandler(formatCategoryTag(newTag), req, res)) // Send tag to response as JSON
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    ) // Send error message
}

/**
 * Update a tag in database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const updateTag = async (req, res) => {
  // Get tag ID from request params
  const { tagId } = req.params

  // Destructure request body to get values
  const { name } = req.body

  // Validate the fields
  if (!Tag.isTagFieldsValid(name)) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Update tag
  Tag.findByPk(tagId)
    .then((tag) => {
      // Check if tag exists
      if (!tag) {
        return errorHandler(
          { statusCode: 404, message: 'No tag found' },
          req,
          res
        )
      }

      // Update tag data
      tag.set({ name })

      // Save it in DB
      tag
        .save()
        .then((updatedTag) =>
          successHandler(formatCategoryTag(updatedTag), req, res)
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
 * Delete a tag from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const deleteTag = async (req, res) => {
  // Get tag ID from params
  const { tagId } = req.params

  // Delete tag from DB
  Tag.destroy({ where: { id: tagId } })
    .then((num) => {
      if (num === 0) {
        // Send error message
        errorHandler({ statusCode: 404, message: 'No tag found' }, req, res)
      } else {
        // Send success message
        successHandler('Tag deleted successfully!', req, res)
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
 * Get posts from database by tag
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
          model: Tag,
          through: {
            where: {
              tag_id: id
            }
          },
          required: true
        }
      ]
    })

    const posts = await Post.findAll({
      include: [
        {
          model: Tag,
          through: {
            where: {
              tag_id: id
            }
          },
          required: true
        },
        { model: Category },
        { model: User },
        { model: Comment }
      ],
      offset,
      limit: parseInt(limit),
      order: [['created_at', order]]
    })

    if (!posts || posts.length === 0) {
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
