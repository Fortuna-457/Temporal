import api from './api'

const authService = {
  login: async (username, password) => {
    try {
      return await api.post('login', { username, password })
    } catch (error) {
      console.error('Error logging in:', error.message)
      throw error
    }
  },

  register: async (user) => {
    try {
      // Check if any necessary field is empty
      if (
        !user.displayName ||
        !user.username ||
        !user.email ||
        !user.password
      ) {
        return {
          ok: false,
          message: 'Necessary fields are required'
        }
      }

      // Check if the password and confirm password match
      if (user.password !== user.confirmPassword) {
        return {
          ok: false,
          message: 'Passwords do not match'
        }
      }

      console.log('Request to api Create user:', user)
      // Make the request to the api
      return await api.post('register', user)
    } catch (error) {
      console.error('Error registering:', error.message)
      throw error
    }
  },

  refreshToken: async (user) => {
    try {
      return await api.post('refresh-token', user)
    } catch (error) {
      console.error('Error refreshing token:', error.message)
      throw error
    }
  }
}

export default authService
