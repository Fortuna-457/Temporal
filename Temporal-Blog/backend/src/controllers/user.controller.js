import { User } from '../models/user.model.js'
import { Post } from '../models/post.model.js'
import { Category } from '../models/category.model.js'
import { Tag } from '../models/tag.model.js'
import { Comment } from '../models/comment.model.js'
import { formatPost, formatUser } from '../utils/utils.js'
import {
  errorHandler,
  successHandler
} from '../middlewares/response.middlewares.js'

/**
 * Get all users from database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getAllUsers = async (req, res) => {
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    order = 'DESC'
  } = req.query
  const offset = (page - 1) * limit

  try {
    // Get all users from DB
    const { count, rows: users } = await User.findAndCountAll({
      offset,
      limit: parseInt(limit),
      order: [['created_at', order]]
    })

    // Check if users were found
    if (!users || !users.length) {
      return errorHandler(
        { statusCode: 404, message: 'No users found' },
        req,
        res
      )
    }

    // Format users
    const formattedUsers = users.map(formatUser)

    // Send users in response as JSON
    return successHandler(
      {
        users: formattedUsers,
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
 * Get user from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getUserById = async (req, res) => {
  // Get user ID from request params
  const { userId } = req.params // Same as: userId = req.params.userId;

  // Get user by ID from DB
  User.findByPk(userId)
    .then((user) =>
      !user
        ? errorHandler({ statusCode: 404, message: 'No user found' }, req, res)
        : successHandler(formatUser(user), req, res)
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
 * Create new user in database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const createUser = async (req, res) => {
  // Destructure request body to get values
  const { displayName, username, password, confirmPassword, email } = req.body

  console.log('Creating user:', req.body)
  // Validate the fields
  if (
    !User.validateAllFields(
      displayName,
      username,
      password,
      confirmPassword,
      email
    )
  ) {
    return errorHandler(
      { statusCode: 400, message: 'Invalid fields' },
      req,
      res
    )
  }

  // Check if password is valid
  if (!User.validatePassword(password)) {
    return errorHandler(
      {
        statusCode: 403,
        message: 'Invalid password format',
        details:
          'Password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number.'
      },
      req,
      res
    )
  }

  // Insert user in DB
  User.create({
    display_name: displayName,
    username,
    password: User.encryptPassword(password),
    email
  })
    .then((newUser) => successHandler(formatUser(newUser), req, res)) // Send user to response as JSON
    .catch((error) =>
      errorHandler(
        { message: error.message, details: 'Internal Server Error' },
        req,
        res
      )
    ) // Send error message
}

/**
 * Update a user in database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const updateUser = async (req, res) => {
  // Get user ID from request params
  const { userId } = req.params

  // Get current user from request
  const curUser = req.user

  // Destructure request body to get values
  let {
    id,
    displayName,
    username,
    password,
    confirmPassword,
    email,
    biography,
    picture,
    roleId
  } = req.body

  try {
    // Find the user by its ID
    let updatedUser = await User.findByPk(userId)

    // Check if the user exists
    if (!updateUser) {
      return errorHandler(
        { statusCode: 404, message: 'User not found' },
        req,
        res
      )
    }

    // Check if any necessary field is empty and passwords match
    if (
      !User.validateNecessaryFields({
        displayName,
        username,
        email
      })
    ) {
      return errorHandler(
        { statusCode: 400, message: 'Necessary fields are required' },
        req,
        res
      )
    }

    // Check if user is updating his own profile or is an admin
    if (updatedUser.id != curUser.id && curUser.roleName !== 'ADMIN') {
      return errorHandler(
        { statusCode: 403, message: 'You can only update your own profile' },
        req,
        res
      )
    }

    // Check if user is updating his role and is not an admin
    if (updatedUser.roleId && curUser.roleName !== 'ADMIN') {
      return errorHandler(
        { statusCode: 403, message: 'You are not allowed to update roles' },
        req,
        res
      )
    }

    // Check if user is updating his password
    if (password) {
      // Check if confirm password is not empty
      if (!confirmPassword) {
        return errorHandler(
          {
            statusCode: 403,
            message: 'Password and Confirm Password are required'
          },
          req,
          res
        )
      }
      // Check if password is valid
      if (!User.validatePassword(password)) {
        return errorHandler(
          {
            statusCode: 403,
            message: 'Invalid password format',
            details:
              'Password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number.'
          },
          req,
          res
        )
      }
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        return errorHandler(
          { statusCode: 400, message: 'Passwords do not match' },
          req,
          res
        )
      }
      // Encrypt password and update user
      updatedUser.password = User.encryptPassword(password)
    }

    console.log('Updating user biography:', biography)

    // Update user
    updatedUser.display_name = displayName
    updatedUser.username = username
    updatedUser.email = email

    if (biography) {
      updatedUser.biography = biography
    }

    if (picture) {
      updatedUser.picture = picture
    }
    if (roleId) {
      updatedUser.role_id = roleId
    }

    // Save user
    const updatedUserData = await updatedUser.save()

    const formattedUser = formatUser(updatedUserData.dataValues)
    return successHandler(formattedUser, req, res)
  } catch (error) {
    console.error('Error updating user:', error.message)
    // Send error message
    return errorHandler(
      { message: error.message, details: 'Internal Server Error' },
      req,
      res
    )
  }
}
/**
 * Delete a user from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const deleteUser = async (req, res) => {
  // Get user ID from params
  const { userId } = req.params

  // Get current user from request
  const curUser = req.user

  // Check if user is deleting his own profile or is an admin
  if (curUser.id != userId && curUser.roleName !== 'ADMIN') {
    return errorHandler(
      { statusCode: 403, message: 'You can only delete your own profile' },
      req,
      res
    )
  }

  // Delete user from DB
  User.destroy({ where: { id: userId } })
    .then((num) => {
      if (num === 0) {
        // Send error message
        return errorHandler(
          { statusCode: 404, message: 'No user found' },
          req,
          res
        )
      } else {
        // Send success message
        return successHandler('User deleted successfully', req, res)
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
 * Get posts from database by author
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getPosts = async (req, res) => {
  // Get author id from request params
  const { id } = req.params

  // Get query params
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    order = 'DESC'
  } = req.query
  const offset = (page - 1) * limit

  try {
    const count = await Post.count({ where: { user_id: id } })

    const posts = await Post.findAll({
      where: { user_id: id },
      include: [
        { model: User },
        { model: Tag },
        { model: Category },
        { model: Comment }
      ],
      offset,
      limit: parseInt(limit),
      order: [['created_at', order]]
    })

    // Check if posts were found
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
