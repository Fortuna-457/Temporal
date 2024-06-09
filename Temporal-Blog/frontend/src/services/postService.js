import api, { defaultQueryParams } from './api'

const postService = {
  getAllPosts: async (options = {}) => {
    const { page, order, status, limit } = options
    try {
      const queryParams = new URLSearchParams({
        ...defaultQueryParams,
        page: page || defaultQueryParams.page,
        order: order || defaultQueryParams.order,
        status: status || defaultQueryParams.status,
        limit: limit || defaultQueryParams.limit
      })

      const url = `posts?${queryParams.toString()}`

      return await api.get(url)
    } catch (error) {
      console.log('Error getting posts:', error.message)
      throw error
    }
  },

  getPostById: async (id) => {
    try {
      return await api.get(`posts/${id}`)
    } catch (error) {
      console.log('Error getting posts :', error.message)
      throw error
    }
  },

  createPost: async (post) => {
    try {
      return await api.post('posts', post)
    } catch (error) {
      console.error('Error creating post:', error.message)
      throw error
    }
  },

  updatePost: async (post) => {
    try {
      return await api.put(`posts/${post.id}`, post)
    } catch (error) {
      console.error('Error updating post:', error.message)
      throw error
    }
  },

  deletePost: async (postId) => {
    try {
      return await api.delete(`posts/${postId}`)
    } catch (error) {
      console.error('Error deleting post:', error.message)
      throw error
    }
  }
}

export default postService
