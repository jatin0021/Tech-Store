import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, getUserOrders);
router.route("/all").get(protect, admin, getAllOrders);
router.route("/:id").put(protect, admin, updateOrderStatus).delete(protect, admin, deleteOrder);

export default router;
