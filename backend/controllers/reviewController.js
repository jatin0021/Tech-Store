import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Helper to update product rating and reviewsCount in DB
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });
    const reviewsCount = reviews.length;
    const rating =
      reviewsCount > 0
        ? Math.round((reviews.reduce((acc, item) => item.rating + acc, 0) / reviewsCount) * 10) / 10
        : 0;

    await Product.findByIdAndUpdate(productId, {
      rating,
      reviewsCount,
    });
  } catch (error) {
    console.error("Failed to update product rating metrics:", error);
  }
};

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (rating === undefined || !comment || !productId) {
    return res.status(400).json({ message: "All review fields are required" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already audited by this user signature" });
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    const createdReview = await review.save();

    // Push review ref and update average rating
    product.reviews.push(createdReview._id);
    await product.save();

    await updateProductRating(productId);

    // Return the created review populated with user details
    const populatedReview = await Review.findById(createdReview._id).populate("user", "name email");

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review audit not found" });
    }

    // Verify ownership
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    review.rating = rating !== undefined ? Number(rating) : review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();

    await updateProductRating(review.product);

    const populatedReview = await Review.findById(updatedReview._id).populate("user", "name email");
    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review audit not found" });
    }

    // Verify ownership
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    const productId = review.product;

    // Remove reference from product
    await Product.findByIdAndUpdate(productId, {
      $pull: { reviews: req.params.id },
    });

    await review.deleteOne();

    await updateProductRating(productId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews/all
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name email")
      .populate("product", "title brand price");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
