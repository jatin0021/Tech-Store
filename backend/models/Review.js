import mongoose from "mongoose";
import { makeMockModel } from "../config/mockDb.js";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = process.env.MOCK_DB === "true" 
  ? makeMockModel("Review") 
  : mongoose.model("Review", reviewSchema);

export default Review;
