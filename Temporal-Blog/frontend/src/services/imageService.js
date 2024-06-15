import Cookies from 'js-cookie'
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const imageService = {
  uploadAvatar: async (body) => {
    try {
      return await fetch(`${BASE_URL}/images/upload/avatar`, {
        method: 'POST',
        headers: {
          Authorization: Cookies.get('_auth')
        },
        body: body
      })
    } catch (error) {
      console.error('Error uploading image', error.message)
      throw error
    }
  },
  uploadThumbnail: async (body) => {
    try {
      return await fetch(`${BASE_URL}/images/upload/post-thumbnail`, {
        method: 'POST',
        headers: {
          Authorization: Cookies.get('_auth')
        },
        body: body
      })
    } catch (error) {
      console.error('Error uploading image', error.message)
      throw error
    }
  }
}

export default imageService
