import api, { defaultQueryParams } from './api'

const commentService = {
  getAllComments: async (options = {}) => {
    const { page, order, status, limit } = options
    try {
      const queryParams = new URLSearchParams({
        ...defaultQueryParams,
        page: page || defaultQueryParams.page,
        order: order || defaultQueryParams.order,
        status: status || defaultQueryParams.status,
        limit: limit || defaultQueryParams.limit
      })

      return await api.get(`comments?${queryParams.toString()}`)
    } catch (error) {
      console.error('Error getting all comments', error.message)
      throw error
    }
  },

  getCommentById: async (id) => {
    try {
      return await api.get(`comments/${id}`)
    } catch (error) {
      console.error('Error getting comment by id', error.message)
      throw error
    }
  },

  createAnonymousComment: async (comment) => {
    try {
      return await api.post('comments/anonymous', comment)
    } catch (error) {
      console.error('Error creating comment', error.message)
      throw error
    }
  },

  createComment: async (comment) => {
    try {
      return await api.post('comments', comment)
    } catch (error) {
      console.error('Error creating comment', error.message)
      throw error
    }
  },

  updateComment: async (comment) => {
    try {
      return await api.put('comments', comment)
    } catch (error) {
      console.error('Error updating comment', error.message)
      throw error
    }
  },

  changeStatus: async (commentId, status) => {
    try {
      return await api.put(`comments/${commentId}/status`, { status })
    } catch (error) {
      console.error('Error changing comment status', error.message)
      throw error
    }
  },

  deleteComment: async (commentId) => {
    try {
      return await api.delete(`comments/${commentId}`)
    } catch (error) {
      console.error('Error deleting comment', error.message)
      throw error
    }
  }
}

export default commentService
