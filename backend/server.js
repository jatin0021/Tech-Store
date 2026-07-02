import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load env variables first
dotenv.config();

// 2. Connect to Database / Mock Setup next (using ESM top-level await)
import connectDB from "./config/db.js";
await connectDB();

// 3. Now dynamically import the route modules (so they get the fully resolved process.env.MOCK_DB flag)
const authRoutes = (await import("./routes/authRoutes.js")).default;
const categoryRoutes = (await import("./routes/categoryRoutes.js")).default;
const productRoutes = (await import("./routes/productRoutes.js")).default;
const cartRoutes = (await import("./routes/cartRoutes.js")).default;
const wishlistRoutes = (await import("./routes/wishlistRoutes.js")).default;
const orderRoutes = (await import("./routes/orderRoutes.js")).default;
const reviewRoutes = (await import("./routes/reviewRoutes.js")).default;

import { configureCloudinary } from "./config/cloudinary.js";
configureCloudinary();

const app = express();

// Middlewares
app.use(cors({
  origin: "*", // Keep flexible for ease of integration
  credentials: true,
}));
app.use(express.json());

// Serve local uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Root path test route
app.get("/", (req, res) => {
  res.json({ message: "Tech Store API is running successfully..." });
});

// Custom 404 Fallback Route Handler
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
