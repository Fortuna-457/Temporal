import { User } from '../models/user.model.js'
import { createToken } from '../utils/utils.js'
import { Role } from '../models/role.model.js'
import {
  errorHandler,
  errorTokenHandler,
  successTokenHandler
} from '../middlewares/response.middlewares.js'

/**
 * Login and generate the token for the user.
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const login = async (req, res) => {
  try {
    console.log(`Initiating log in function:`)
    const { username, password } = req.body

    // Find the user in the database
    const user = await User.findOne({ where: { username } })

    console.log(`\t Trying to get user: ${username}`)

    // Check if we have a user
    if (!user) {
      console.error(`\t User not found: ${username}`)
      // Return error with errorHandler middleware
      return errorTokenHandler(
        { statusCode: 404, message: 'Incorrect username or password' },
        req,
        res
      )
    }

    // Check password
    if (!User.comparePassword(password, user.password)) {
      console.error(`\t Password doesn't match : ${password}`)
      // Return error with errorHandler middleware
      return errorTokenHandler(
        { statusCode: 404, message: 'Incorrect username or password' },
        req,
        res
      )
    }

    // Check the role
    const role = await Role.findByPk(user.role_id)
    if (!role) {
      console.error(`Role not found: ${user.role_id}`)
      // Return error with errorHandler middleware
      return errorTokenHandler(
        { statusCode: 404, message: 'No role found' },
        req,
        res
      )
    }

    // Role found add to user object
    user.role_name = role.name

    // Success response with successTokenHandler middleware
    return successTokenHandler(createToken(user), req, res)
  } catch (error) {
    console.error(`Error in login function: `, error.message)
    return errorHandler(
      { message: error.message, details: 'Internal Server Error' },
      req,
      res
    )
  }
}

/**
 * Register a new user in the database.
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const register = async (req, res) => {
  try {
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
        { statusCode: 400, message: 'All fields are required' },
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
    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return errorHandler(
        { statusCode: 400, message: 'Passwords do not match' },
        req,
        res
      )
    }

    // Create the user in the database
    const newUser = await User.create({
      display_name: displayName,
      username,
      password: User.encryptPassword(password),
      email
    })

    // Check if the user was created
    if (!newUser) {
      return errorHandler(
        { statusCode: 400, message: 'Error creating user' },
        req,
        res
      )
    }

    // Success response with successTokenHandler middleware
    return successTokenHandler(createToken(newUser), req, res)
  } catch (error) {
    console.error(`Error in register function: `, error.message)
    return errorHandler(
      { message: error.message, details: 'Internal Server Error' },
      req,
      res
    )
  }
}

/**
 * Refresh the token for the user. This is used when the token is expired.
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const refreshToken = async (req, res) => {
  try {
    const curUser = req.user
    const user = req.body

    // Check the role
    const role = await Role.findByPk(user.roleId)
    if (!role) {
      console.error(`Role not found: ${user.roleId}`)
      // Return error with errorHandler middleware
      return errorTokenHandler(
        { statusCode: 404, message: 'No role found' },
        req,
        res
      )
    }

    // Role found add to user object
    user.roleName = role.name

    return successTokenHandler(createToken(user), req, res)
  } catch (error) {
    console.error(`Error in refresh token function: `, error.message)
    return errorHandler(
      { message: error.message, details: 'Internal Server Error' },
      req,
      res
    )
  }
}
