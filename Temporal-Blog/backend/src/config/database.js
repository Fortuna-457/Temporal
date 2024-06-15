import { Sequelize } from "sequelize";

// Config .env
import dotenv from "dotenv";
dotenv.config();

export const db = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
);
