import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { Role } from '../models/role.model.js'
import { errorHandler, errorTokenHandler } from './response.middlewares.js'

/**
 * Verify the JWT token.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
export const checkToken = async (req, res, next) => {
  // Get token from request headers
  const token = req.headers['authorization']

  // Check token
  if (!token) {
    // If there isn't token, send 403 status code and message
    return errorHandler(
      { statusCode: 403, message: 'You must include authorization header' },
      req,
      res
    )
  }

  // Verify the token with secret key
  let obj
  try {
    obj = jwt.verify(token, process.env.JWT_SECRET_KEY)
  } catch (error) {
    // If token is invalid, send 403 status code and message
    return errorHandler({ statusCode: 403, message: error.message }, req, res)
  }

  const user = await User.findByPk(obj.user.id)
  if (!user) {
    return errorTokenHandler(
      { statusCode: 404, message: 'No user found' },
      req,
      res
    )
  }

  // Save user to req variable and continue
  req.user = obj.user
  next()
}
