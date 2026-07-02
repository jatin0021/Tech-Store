import mongoose from "mongoose";
import { makeMockModel } from "../config/mockDb.js";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist = process.env.MOCK_DB === "true" 
  ? makeMockModel("Wishlist") 
  : mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
