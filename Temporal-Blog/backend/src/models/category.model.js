import { DataTypes } from 'sequelize'
import { db } from '../config/database.js'

export const Category = db.define(
  'categories',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
    },
  },
  {
    timestamps: true, // Enable timestamps
    createdAt: 'created_at', // Modify name for createdAt column
    updatedAt: 'updated_at', // Modify name for updatedAt column
  },
)

/** ------------------------------------------------------
 * Category Validation
 * ---------------------------------------------------- */
Category.isCategoryFieldsValid = (name) => {
  return name?.trim().length > 0
}
