import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
  // Get the cookie from the browser
  const cookie = Cookies.get('_auth')

  let userId = null
  let displayName = null
  let username = null
  let email = null
  let picture = null
  let roleId = null
  let roleName = null
  let token = null

  if (cookie) {
    // Decode token
    const decoded = jwtDecode(cookie)

    // Check if token is expired
    const isExpired = decoded?.exp < Date.now() / 1000

    if (isExpired) {
      // If it's expired remove cookie
      Cookies.remove('_auth')
    } else {
      // If not get its data
      userId = decoded.user.id
      displayName = decoded.user.displayName
      username = decoded.user.username
      email = decoded.user.email
      picture = decoded.user.picture
      roleId = decoded.user.roleId
      roleName = decoded.user.roleName
      token = cookie
    }
  }

  return {
    userId,
    displayName,
    username,
    email,
    picture,
    roleId,
    roleName,
    token
  }
}

export default useAuth
