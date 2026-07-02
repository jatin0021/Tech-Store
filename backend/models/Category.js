import mongoose from "mongoose";
import { makeMockModel } from "../config/mockDb.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = process.env.MOCK_DB === "true" 
  ? makeMockModel("Category") 
  : mongoose.model("Category", categorySchema);

export default Category;
