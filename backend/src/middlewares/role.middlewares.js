/**
 * Verify if the user has the allowed roles.
 * @param allowedRoles The allowed roles
 * @returns {(function(*, *, *): Promise<*|undefined>)|*}
 */
export const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    const userRole = req.user.roleName

    if (!allowedRoles.includes(userRole)) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    next()
  }
}
