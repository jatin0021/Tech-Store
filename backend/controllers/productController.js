import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";

// Helper to upload image to Cloudinary or use local fallback
const handleImageUpload = async (file) => {
  if (!file) return null;

  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "placeholder_cloud_name" &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== "placeholder_api_key";

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "tech-store",
      });
      // Delete temporary file from local uploads
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed, falling back to local path:", error);
      return `/uploads/${file.filename}`;
    }
  } else {
    // If no credentials, we keep it locally and serve via express static
    return `/uploads/${file.filename}`;
  }
};

// @desc    Get all products (with Search, Filter, Sort, Pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStockOnly,
      sortBy,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // 1. Search Query Regex
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // 2. Category Filter
    if (category && category !== "all") {
      // Find category by slug or ID
      const cat = await Category.findOne({
        $or: [{ slug: category }, { name: category }],
      });
      if (cat) {
        query.category = cat._id;
      } else if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      }
    }

    // 3. Brand Filter
    if (brand && brand !== "all") {
      query.brand = brand;
    }

    // 4. Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 5. Rating Filter (Get products with rating >= value)
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 6. Availability Filter
    if (inStockOnly === "true" || inStockOnly === true) {
      query.stock = { $gt: 0 };
    }

    // 7. Sorting
    let sortOptions = {};
    if (sortBy) {
      switch (sortBy) {
        case "newest":
          sortOptions = { createdAt: -1 };
          break;
        case "price-low-high":
          sortOptions = { price: 1 };
          break;
        case "price-high-low":
          sortOptions = { price: -1 };
          break;
        case "rating":
          sortOptions = { rating: -1 };
          break;
        case "popularity":
        default:
          sortOptions = { reviewsCount: -1 };
          break;
      }
    } else {
      sortOptions = { createdAt: -1 };
    }

    // 8. Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name email" },
      });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product signature not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      specifications,
      featured,
    } = req.body;

    // Handle specifications JSON string parsing
    let parsedSpecs = specifications;
    if (typeof specifications === "string") {
      try {
        parsedSpecs = JSON.parse(specifications);
      } catch (err) {
        parsedSpecs = {};
      }
    }

    // Check category valid id, if not, find by name/slug
    let categoryId = category;
    if (category && !category.match(/^[0-9a-fA-F]{24}$/)) {
      const catObj = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { name: category }],
      });
      if (catObj) {
        categoryId = catObj._id;
      }
    }

    const imageUrl = await handleImageUpload(req.file);
    const images = imageUrl ? [imageUrl] : (req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : []);

    const product = new Product({
      title,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      images,
      category: categoryId,
      brand,
      stock: Number(stock),
      specifications: parsedSpecs || {},
      featured: featured === "true" || featured === true,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      specifications,
      featured,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.discountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
      product.brand = brand || product.brand;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.featured = featured !== undefined ? (featured === "true" || featured === true) : product.featured;

      if (category) {
        let categoryId = category;
        if (!category.match(/^[0-9a-fA-F]{24}$/)) {
          const catObj = await Category.findOne({
            $or: [{ slug: category.toLowerCase() }, { name: category }],
          });
          if (catObj) {
            categoryId = catObj._id;
          }
        }
        product.category = categoryId;
      }

      if (specifications) {
        let parsedSpecs = specifications;
        if (typeof specifications === "string") {
          try {
            parsedSpecs = JSON.parse(specifications);
          } catch (err) {
            parsedSpecs = {};
          }
        }
        product.specifications = parsedSpecs;
      }

      const newImageUrl = await handleImageUpload(req.file);
      if (newImageUrl) {
        product.images = [newImageUrl];
      } else if (req.body.images) {
        product.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product signature not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product signature purged" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product brands catalog
// @route   GET /api/products/brands
// @access  Public
export const getProductBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
