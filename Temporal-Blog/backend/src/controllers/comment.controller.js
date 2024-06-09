import { Comment } from '../models/comment.model.js'
import { User } from '../models/user.model.js'
import { formatComment } from '../utils/utils.js'
import {
  errorHandler,
  successHandler
} from '../middlewares/response.middlewares.js'
import { Op } from 'sequelize'

/**
 * Get all comments from database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getAllComments = async (req, res) => {
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    status = 'all',
    order = 'DESC'
  } = req.query
  const offset = (page - 1) * limit

  // Filter status
  const statusFilter =
    status === 'all' ? { [Op.in]: ['approved', 'pending'] } : status

  try {
    // Get the total count of comments
    const count = await Comment.count({
      where: {
        status: statusFilter
      }
    })

    // Get all comments from DB
    const comments = await Comment.findAll({
      offset,
      limit: parseInt(limit),
      where: {
        status: statusFilter
      },
      order: [['created_at', order]]
    })

    // Check if comments were found
    if (!comments || !comments.length) {
      return errorHandler(
        { statusCode: 404, message: 'No comments found' },
        req,
        res
      )
    }

    // Send comments in response as JSON
    return successHandler(
      {
        comments: comments.map(formatComment),
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
 * Get comment from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getCommentById = async (req, res) => {
  // Get comment ID from request params
  const { commentId } = req.params // Same as: commentId = req.params.commentId;

  // Get comment by ID from DB
  Comment.findByPk(commentId)
    .then((comment) =>
      !comment
        ? errorHandler(
            { statusCode: 404, message: 'No comment found' },
            req,
            res
          )
        : successHandler(formatComment(comment), req, res)
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
 * Create new comment in database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const createComment = async (req, res) => {
  // Destructure request body to get values
  const { content, userId, postId } = req.body

  // Check if there is user role
  const { roleName } = req.user

  console.log('req.body', req.body)
  console.log('Role name', roleName)
  // Validate the fields
  if (!Comment.validateAllFields({ content, postId })) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Check if user exists
  const user = await User.findByPk(userId)

  if (!user) {
    return errorHandler({ statusCode: 404, message: 'No user found' }, req, res)
  }

  let status = 'pending'
  // Check role to set status of comment
  if (roleName === 'EDITOR' || roleName === 'ADMIN') {
    status = 'approved'
  }

  // Insert comment in DB
  Comment.create({
    content,
    status,
    user_id: userId,
    post_id: postId
  })
    .then((comment) => successHandler(formatComment(comment), req, res))
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    )
}

export const createAnonymousComment = async (req, res) => {
  // Destructure request body to get values
  const { content, postId, userName } = req.body

  // Validate the fields
  if (!Comment.validateAllFields({ content, postId, userName })) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Insert comment in DB
  Comment.create({
    content,
    status: 'pending',
    user_name: userName,
    post_id: postId
  })
    .then((comment) => successHandler(formatComment(comment), req, res))
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    )
}

/**
 * Update a comment in database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const updateComment = async (req, res) => {
  // Get comment ID from request params
  const { commentId } = req.params // Same as: commentId = req.params.commentId;

  // Destructute request body to get values
  const { content, status, userId, postId, parentId } = req.body

  // Validate the fields
  if (!Comment.validateAllFields(content, status, userId, postId, parentId)) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Check if user exists
  const user = await User.findByPk(userId)

  if (!user) {
    return errorHandler({ statusCode: 404, message: 'No user found' }, req, res)
  }

  // Update the comment
  Comment.findByPk(commentId)
    .then((comment) => {
      if (!comment) {
        return errorHandler(
          { statusCode: 404, message: 'No comment found' },
          req,
          res
        )
      }

      return comment.update({
        content,
        status,
        user_id: userId,
        post_id: postId,
        parent_id: parentId
      })
    })
    .then((comment) => successHandler(formatComment(comment), req, res))
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    )
}

/**
 * Change the status of a comment in database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const changeStatus = async (req, res) => {
  // Get comment ID from request params
  const { commentId } = req.params // Same as: commentId = req.params.commentId;

  // Destructure request body to get values
  const { status } = req.body

  // Validate the fields
  if (!Comment.validateAllFields({ status })) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Update the comment status
  Comment.findByPk(commentId)
    .then((comment) => {
      if (!comment) {
        return errorHandler(
          { statusCode: 404, message: 'No comment found' },
          req,
          res
        )
      }

      return comment.update({ status })
    })
    .then((comment) => successHandler(formatComment(comment), req, res))
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    )
}

/**
 * Delete a comment from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const deleteComment = async (req, res) => {
  // Get comment ID from request params
  const { commentId } = req.params // Same as: commentId = req.params.commentId;

  // Delete comment from DB
  Comment.destroy({ where: { id: commentId } })
    .then((num) =>
      num === 1
        ? successHandler('Comment was deleted successfully', req, res)
        : errorHandler(
            { statusCode: 404, message: 'No comment found' },
            req,
            res
          )
    )
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    )
}
