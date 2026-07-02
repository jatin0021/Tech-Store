import mongoose from "mongoose";
import { makeMockModel, loadFromFile, seedMockDB } from "./mockDb.js";

console.log("Initializing database connection...");

try {
  // Try connecting to process.env.MONGO_URI (Atlas) with a 2-second timeout
  if (!process.env.MONGO_URI) {
    throw new Error("No MONGO_URI specified in env.");
  }
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 2000,
  });
  console.log("Connected to MongoDB Atlas database cluster.");
} catch (error) {
  console.warn(`MongoDB Atlas Connection Failed: ${error.message}`);
  
  // Fallback to local MongoDB
  try {
    console.log("Attempting local MongoDB connection...");
    await mongoose.connect("mongodb://127.0.0.1:27017/tech-store", {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("Connected to local MongoDB database.");
  } catch (localError) {
    console.warn(`Local MongoDB Connection Failed: ${localError.message}`);
    console.warn("Re-routing system resources to Mock local database storage...");
    
    process.env.MOCK_DB = "true";
    
    // Override mongoose.model loader
    const mockModels = {};
    mongoose.model = function (name, schema) {
      if (!mockModels[name]) {
        mockModels[name] = makeMockModel(name);
      }
      return mockModels[name];
    };

    // Load mock database JSON state
    const loaded = loadFromFile();
    if (!loaded) {
      await seedMockDB();
    }
  }
}

const connectDB = async () => {
  // Mongoose is already connected or mocked in ESM phase
};

export default connectDB;
