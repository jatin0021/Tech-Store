import mongoose from "mongoose";
import { makeMockModel } from "../config/mockDb.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = process.env.MOCK_DB === "true" 
  ? makeMockModel("Cart") 
  : mongoose.model("Cart", cartSchema);

export default Cart;
