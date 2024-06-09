import jwt from 'jsonwebtoken'

export const createToken = (user) => {
  const obj = {
    user: {
      id: user.id,
      displayName: user.display_name ?? user.displayName,
      username: user.username,
      email: user.email,
      biography: user.biography,
      roleId: user.role_id ?? user.roleId,
      roleName: user.role_name ?? user.roleName,
      picture: user.picture
    }
  }

  return jwt.sign(obj, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME
  })
}

// Format post as JSON response
export const formatPost = (post) => {
  const formattedPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    thumbnail: post.thumbnail,
    status: post.status,
    userId: post.user_id,
    categories: [],
    tags: [],
    comments: [],
    createdAt: post.created_at,
    updatedAt: post.updated_at
  }

  if (post.categories && post.categories.length > 0) {
    formattedPost.categories = post.categories.map((category) => category.id)
  }

  if (post.tags && post.tags.length > 0) {
    formattedPost.tags = post.tags.map((tag) => tag.id)
  }

  if (post.comments && post.comments.length > 0) {
    formattedPost.comments = post.comments.map((comment) => comment.id)
  }

  return formattedPost
}

// Format user as JSON response
export const formatUser = (user) => {
  return {
    id: user.id,
    displayName: user.display_name,
    username: user.username,
    email: user.email,
    biography: user.biography,
    picture: user.picture,
    roleId: user.role_id,
    createdAt: user.created_at
  }
}

// Format comment as JSON response
export const formatComment = (comment) => {
  return {
    id: comment.id,
    content: comment.content,
    status: comment.status,
    userId: comment.user_id,
    userName: comment.user_name,
    postId: comment.post_id,
    parentId: comment.parent_id,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at
  }
}

// Format category and tag as JSON response
export const formatCategoryTag = (item) => {
  return {
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }
}
