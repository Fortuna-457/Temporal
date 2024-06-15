import { DataTypes } from 'sequelize'
import { db } from '../config/database.js'

export const Role = db.define(
  'roles',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  },
  {
    timestamps: true, // Enable timestamps
    createdAt: 'created_at', // Modify name for createdAt column
    updatedAt: 'updated_at' // Modify name for updatedAt column
  }
)
