import { DataTypes } from 'sequelize'
import { db } from '../config/database.js'
import { User } from './user.model.js'

export const Comment = db.define(
  'comments',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('approved', 'pending'),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    timestamps: true, // Enable timestamps
    createdAt: 'created_at', // Modify name for createdAt column
    updatedAt: 'updated_at' // Modify name for updatedAt column
  }
)

// Relationship with Users
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})

// Relationship with Comment
Comment.belongsTo(Comment, {
  foreignKey: 'parent_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})

/**
 * Validate comment fields
 * @param {object} params - Comment fields
 * @returns {boolean} Returns true if all fields are valid
 */
Comment.validateAllFields = (params) => {
  for (const key in params) {
    if (key === 'id') continue
    if (key === 'postId') {
      if (
        params[key] === null ||
        params[key] === undefined ||
        isNaN(params[key])
      ) {
        return false
      }
    } else {
      if (
        params[key] === null ||
        params[key] === undefined ||
        (typeof params[key] === 'string' && params[key].trim().length === 0)
      ) {
        return false
      }
    }
  }
  return true
}
