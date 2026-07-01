import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Order from "../models/Order.js";
import { PRODUCTS } from "../../src/data/product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tech-store";

const seedData = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected. Purging database logs...");

    // Purge existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Order.deleteMany();

    console.log("Purged successful. Seeding categories...");

    // Create Categories
    const categoriesToSeed = [
      { name: "Laptops", slug: "laptops" },
      { name: "Smartphones", slug: "smartphones" },
      { name: "Audio", slug: "audio" },
      { name: "Wearables", slug: "wearables" },
      { name: "Gaming", slug: "gaming" },
      { name: "Smart Home", slug: "smarthome" },
    ];

    const seededCategories = await Category.insertMany(categoriesToSeed);
    
    // Create mapping of category slug to ID
    const categoryMap = {};
    seededCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log("Categories seeded. Seeding users...");

    // Create Admin & User
    const adminUser = await User.create({
      name: "Admin Operator",
      email: "admin@techstore.com",
      password: "adminpassword123",
      phone: "1234567890",
      address: {
        street: "1 Admin Way",
        city: "Neo City",
        state: "CA",
        pincode: "94016",
      },
      role: "admin",
    });

    const standardUser = await User.create({
      name: "John Customer",
      email: "user@techstore.com",
      password: "userpassword123",
      phone: "9876543210",
      address: {
        street: "128 Cyber Avenue",
        city: "Neo City",
        state: "CA",
        pincode: "94016",
      },
      role: "user",
    });

    console.log("Users seeded. Seeding products...");

    // Create Products
    const productsToSeed = PRODUCTS.map((product) => {
      const brand = product.name.split(" ")[0];
      const categoryId = categoryMap[product.category] || seededCategories[0]._id;
      
      // Calculate discount price for featured items (10% off)
      const discountPrice = product.featured
        ? Math.round(product.price * 0.9 * 100) / 100
        : 0;

      return {
        title: product.name,
        description: product.description,
        price: product.price,
        discountPrice,
        images: [product.image],
        category: categoryId,
        brand,
        stock: product.stock,
        specifications: product.specifications || {},
        features: product.features || [],
        rating: product.rating || 0,
        reviewsCount: product.reviewsCount || 0,
        featured: product.featured || false,
      };
    });

    await Product.insertMany(productsToSeed);
    console.log("Products seeded successfully!");

    await mongoose.connection.close();
    console.log("Database connection closed. Seeding process complete.");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
