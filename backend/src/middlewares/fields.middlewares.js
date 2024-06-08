import { User } from '../models/user.model.js'

/**
 * Verify that the necessary fields are not empty.
 * - Necessary fields: username, password
 * - If the fields are empty, send a 400 status code and a message.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
export const verifyNecessaryFields = (req, res, next) => {
  // Get the username and password from the request body
  const { username, password } = req.body

  // If the fields are undefined, null or empty, send a 400 status code and a message
  if (!username?.trim() || !password?.trim()) {
    res
      .status(400)
      .json({ message: 'The fields username & password are required' })
    return
  }

  next() // Call the next middleware
}

/**
 * Verify that the necessary fields are not empty.
 * - Necessary fields: displayName, username, password, email
 * - If the fields are empty, send a 400 status code and a message.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
export const verifyAllFields = (req, res, next) => {
  // Get the username, email and password from the request body
  const { displayName, username, password, email, confirmPassword } = req.body

  if (
    !User.validateAllFields(
      displayName,
      username,
      password,
      email,
      confirmPassword,
    )
  ) {
    res.status(400).json({ message: 'All fields are empty' })
    return
  }

  next() // Call the next middleware
}

/**
 * Verify that the username  are not already in use.
 * - If the username are already in use, send a 400 status code and a message.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
export const checkDuplicateUsername = async (req, res, next) => {
  // Get the username from the request body
  const { username } = req.body

  // Check if the username already exists
  const user = User.exists(username)

  if (user) {
    res.status(400).json({ message: 'The username already exists' })
    return
  }

  next() // Call the next middleware
}
