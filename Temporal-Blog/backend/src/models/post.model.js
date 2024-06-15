import { DataTypes } from 'sequelize'
import { db } from '../config/database.js'
import { User } from './user.model.js'
import { Comment } from './comment.model.js'
import { Tag } from './tag.model.js'
import { Category } from './category.model.js'

export const Post = db.define(
  'posts',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('published', 'draft'),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: true, // Enable timestamps
    createdAt: 'created_at', // Modify name for createdAt column
    updatedAt: 'updated_at' // Modify name for updatedAt column
  }
)

// 1:N Relationship between PostCard and User
User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})

// 1:N Relationship between PostCard and Comment
Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// N:M Relationship between PostCard and Tag
Post.belongsToMany(Tag, {
  through: 'post_tag',
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Tag.belongsToMany(Post, {
  through: 'post_tag',
  foreignKey: 'tag_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// N:M Relationship between PostCard and Category
Post.belongsToMany(Category, {
  through: 'post_category',
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Category.belongsToMany(Post, {
  through: 'post_category',
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
