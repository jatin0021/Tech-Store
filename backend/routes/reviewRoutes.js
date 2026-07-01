import express from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createReview);
router.route("/all").get(protect, admin, getAllReviews);
router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

export default router;
