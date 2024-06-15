import { DataTypes } from "sequelize";
import { db } from "../config/database.js";

export const Page = db.define(
  "pages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    template: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("published", "draft", "archived"),
      allowNull: false,
    },
  },
  {
    timestamps: true, // Enable timestamps
    createdAt: "created_at", // Modify name for createdAt column
    updatedAt: "updated_at", // Modify name for updatedAt column
  },
);

/** ------------------------------------------------------
 * Page Validation
 * ---------------------------------------------------- */
Page.isPageFieldsValid = (title, status) => {
  return (
    title?.trim().length > 0 &&
    (status === "published" || status === "draft" || status === "archived")
  );
};
