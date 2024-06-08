import { Post } from '../models/post.model.js'
import { Category } from '../models/category.model.js'
import { Tag } from '../models/tag.model.js'
import { Comment } from '../models/comment.model.js'
import { formatPost } from '../utils/utils.js'
import {
  errorHandler,
  successHandler
} from '../middlewares/response.middlewares.js'
import { Op } from 'sequelize'

/**
 * Get all posts from database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getAllPosts = async (req, res) => {
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    order = 'DESC',
    status = 'all'
  } = req.query
  const offset = (page - 1) * limit

  // Filter status
  const statusFilter =
    status === 'all' ? { [Op.in]: ['published', 'draft'] } : status

  try {
    // Get the total count of posts
    const totalCount = await Post.count({
      where: {
        status: statusFilter
      }
    })

    // Get all posts from DB
    const posts = await Post.findAll({
      include: [{ model: Category }, { model: Tag }, { model: Comment }],
      offset,
      limit: parseInt(limit),
      where: {
        status: statusFilter
      },
      order: [['created_at', order]]
    })

    // Check if posts were found
    if (!posts || posts.length === 0) {
      // Return error
      return errorHandler(
        { statusCode: 404, message: 'No posts found' },
        req,
        res
      )
    }

    // Format post
    const formattedPosts = posts.map(formatPost)

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit)

    // Send posts in response as JSON
    return successHandler(
      {
        posts: formattedPosts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalCount
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
 * Get post from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const getPostById = async (req, res) => {
  // Get post ID from request params
  const { postId } = req.params // Same as: postId = req.params.postId;

  // Get post by ID from DB
  Post.findByPk(postId, {
    include: [{ model: Category }, { model: Tag }, { model: Comment }]
  })
    .then((post) => {
      // Check if a post was found
      if (!post) {
        // Return error with errorHandler middleware
        return errorHandler(
          { statusCode: 404, message: 'No post found' },
          req,
          res
        )
      }

      // Format response as JSON
      const formattedPost = formatPost(post)

      // Send post in response as JSON
      return successHandler(formattedPost, req, res)
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
 * Create new post in database
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const createPost = async (req, res) => {
  try {
    // Destrucre post object from request body
    const {
      title,
      content,
      status,
      thumbnail,
      userId,
      categories,
      comments,
      tags
    } = req.body

    // Get current user from request
    const curUser = req.user

    // Check if any necessary field is empty
    if (!title || !content || !status || !userId) {
      return errorHandler(
        { statusCode: 400, message: 'Necessary fields are required' },
        req,
        res
      )
    }

    switch (curUser.roleName) {
      case 'SUBSCRIBER':
        console.log('User is a subscriber')

        return errorHandler(
          {
            statusCode: 403,
            message: 'You are not authorized to create posts'
          },
          req,
          res
        )

        break
      case 'CONTRIBUTOR':
        console.log('User is a contributor')

        // Check if the user is the author of the post
        if (curUser.id !== userId) {
          return errorHandler(
            {
              statusCode: 403,
              message: 'You are not authorized to create this post'
            },
            req,
            res
          )
        }

        // Check if the post is published
        if (status === 'published') {
          return errorHandler(
            {
              statusCode: 403,
              message: 'You are not authorized to publish this post'
            },
            req,
            res
          )
        }

        break
      case 'AUTHOR':
        console.log('User is an author')

        // Check if the user is the author of the post
        if (curUser.id !== userId) {
          return errorHandler(
            {
              statusCode: 403,
              message: 'You are not authorized to create this post'
            },
            req,
            res
          )
        }
    }

    // Create post in DB
    const newPost = await Post.create({
      title,
      content,
      status,
      thumbnail,
      user_id: userId
    })

    // Handle categories
    for (const category of categories) {
      // Find category by name
      const [cat, created] = await Category.findOrCreate({
        where: { name: category.name },
        defaults: category
      })
      await newPost.addCategory(cat)
    }

    // Handle tags
    for (const tag of tags) {
      const [tg, created] = await Tag.findOrCreate({
        where: { name: tag.name },
        defaults: tag
      })
      await newPost.addTag(tg)
    }

    // Get the new post
    const newPostData = await Post.findByPk(newPost.id, {
      include: [{ model: Category }, { model: Tag }, { model: Comment }]
    })

    // Format response as JSON
    const formattedPost = formatPost(newPostData.dataValues)

    console.log('Post created successfully')
    return successHandler(formattedPost, req, res)
  } catch (error) {
    // Send error message
    return errorHandler(
      { message: error.message, details: 'Internal Server Error' },
      req,
      res
    )
  }
}

/**
 * Update a post in database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const updatePost = async (req, res) => {
  // Get post ID from request params
  const { postId } = req.params // Same as: postId = req.params.postId;

  // Desctructure post object from request body
  const {
    id,
    title,
    content,
    status,
    thumbnail,
    userId,
    categories,
    comments,
    tags
  } = req.body

  // Get current user from request
  const curUser = req.user

  try {
    // Find the post by its ID
    let curPost = await Post.findByPk(postId)

    // Check if the post exists
    if (!curPost) {
      return errorHandler(
        { statusCode: 404, message: 'Post not found' },
        req,
        res
      )
    }

    // Check if any necessary field is empty
    if (!title || !content || !status || !userId) {
      return errorHandler(
        { statusCode: 400, message: 'Necessary fields are required' },
        req,
        res
      )
    }

    switch (curUser.roleName) {
      case 'SUBSCRIBER':
        console.log('User is a subscriber')

        return errorHandler(
          {
            statusCode: 403,
            message: 'You are not authorized to update posts'
          },
          req,
          res
        )

        break
      case 'CONTRIBUTOR':
        console.log('User is a contributor')

        // Check if the user is the author of the post
        if (curUser.id !== userId) {
          return errorHandler(
            {
              statusCode: 403,
              message: 'You are not authorized to update this post'
            },
            req,
            res
          )
        }

        // Check if the post is published
        if (status === 'published') {
          return errorHandler(
            {
              statusCode: 403,
              message: 'You are not authorized to publish this post'
            },
            req,
            res
          )
        }

        break
      case 'AUTHOR':
        console.log('User is an author')

        // Check if the user is the author of the post
        if (curUser.id !== userId) {
          return errorHandler(
            {
              statusCode: 403,
              message: 'You are not authorized to update this post'
            },
            req,
            res
          )
        }
    }

    // Update the post fields
    curPost.title = title
    curPost.content = content
    curPost.status = status
    curPost.thumbnail = thumbnail || curPost.thumbnail
    curPost.user_id = userId

    // Handle categories
    await curPost.setCategories([]) // Remove all categories
    for (const category of categories) {
      // Find category by name
      const [cat, created] = await Category.findOrCreate({
        where: { name: category.name },
        defaults: category
      })
      await curPost.addCategory(cat)
    }

    // Handle tags
    await curPost.setTags([]) // Remove all tags
    for (const tag of tags) {
      const [tg, created] = await Tag.findOrCreate({
        where: { name: tag.name },
        defaults: tag
      })
      await curPost.addTag(tg)
    }

    // Save the post
    await curPost.save()

    // Get updated post
    const updatedPostData = await Post.findByPk(postId, {
      include: [{ model: Category }, { model: Tag }, { model: Comment }]
    })

    // Format response as JSON
    const formattedPost = formatPost(updatedPostData.dataValues)

    console.log('Post updated successfully')
    return successHandler(formattedPost, req, res)
  } catch (error) {
    console.error('Error updating post:', error.message)
    // Send error message
    return errorHandler(
      { message: error.message, details: 'Internal Server Error' },
      req,
      res
    )
  }
}

/**
 * Delete a post from database by id
 * @param {*} req The request object from Express
 * @param {*} res The response object from Express
 */
export const deletePost = async (req, res) => {
  try {
    // Get post ID from params
    const { postId } = req.params

    // Delete post from DB
    const deletedPost = await Post.destroy({ where: { id: postId } })

    // Check if post was deleted
    if (!deletedPost) {
      // Return error
      return errorHandler(
        { statusCode: 404, message: 'Post not found' },
        req,
        res
      )
    }

    // Send success message
    return successHandler('Post deleted successfully', req, res)
  } catch (error) {
    // Send error message
    errorHandler(
      { message: error.message, details: 'Internal Server Error' },
      req,
      res
    )
  }
}
