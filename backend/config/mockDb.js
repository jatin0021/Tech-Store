import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { PRODUCTS } from "../../src/data/product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, "../uploads/mock_db.json");

// In-memory collections
export const collections = {
  User: [],
  Category: [],
  Product: [],
  Cart: [],
  Wishlist: [],
  Order: [],
  Review: []
};

// Save to disk helper
export function saveToFile() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(collections, null, 2));
  } catch (err) {
    console.error("Failed to save mock database:", err);
  }
}

// Load from disk helper
export function loadFromFile() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      Object.assign(collections, JSON.parse(data));
      console.log("Mock database loaded successfully from local storage.");
      return true;
    }
  } catch (err) {
    console.error("Failed to load mock database from file:", err);
  }
  return false;
}

// Seeding function
export async function seedMockDB() {
  console.log("Initializing seed data for mock database...");
  
  // Seed Categories
  collections.Category = [
    { _id: "cat_laptops", name: "Laptops", slug: "laptops" },
    { _id: "cat_smartphones", name: "Smartphones", slug: "smartphones" },
    { _id: "cat_audio", name: "Audio", slug: "audio" },
    { _id: "cat_wearables", name: "Wearables", slug: "wearables" },
    { _id: "cat_gaming", name: "Gaming & PC", slug: "gaming" },
    { _id: "cat_smarthome", name: "Smart Home", slug: "smarthome" },
  ];

  // Seed Users
  collections.User = [
    {
      _id: "user_admin",
      name: "Admin Operator",
      email: "admin@techstore.com",
      password: await bcrypt.hash("adminpassword123", 10),
      phone: "1234567890",
      address: { street: "1 Admin Way", city: "Neo City", state: "CA", pincode: "94016" },
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      _id: "user_customer",
      name: "John Customer",
      email: "user@techstore.com",
      password: await bcrypt.hash("userpassword123", 10),
      phone: "9876543210",
      address: { street: "128 Cyber Avenue", city: "Neo City", state: "CA", pincode: "94016" },
      role: "user",
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Products
  collections.Product = PRODUCTS.map((p) => {
    const brand = p.name.split(" ")[0];
    const cat = collections.Category.find(c => c.slug === p.category) || collections.Category[0];
    return {
      _id: `prod_${p.id}`,
      title: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.featured ? Math.round(p.price * 0.9 * 100) / 100 : 0,
      images: [p.image],
      category: { _id: cat._id, name: cat.name, slug: cat.slug },
      brand,
      stock: p.stock,
      specifications: p.specifications || {},
      features: p.features || [],
      rating: p.rating || 0,
      reviewsCount: p.reviewsCount || 0,
      featured: p.featured || false,
      createdAt: new Date().toISOString()
    };
  });

  saveToFile();
  console.log("Mock database seeding completed.");
}

// Query helper to filter collection items
function filterCollection(list, query) {
  let results = [...list];

  // Handle $or query
  if (query.$or) {
    results = results.filter(item => {
      return query.$or.some(clause => {
        return Object.entries(clause).every(([key, val]) => {
          if (val && typeof val === "object" && val.$regex) {
            const regex = new RegExp(val.$regex, val.$options || "");
            return regex.test(item[key]);
          }
          return String(item[key]) === String(val);
        });
      });
    });
  }

  // Handle standard properties matching
  Object.entries(query).forEach(([key, val]) => {
    if (key === "$or") return;
    results = results.filter(item => {
      if (val && typeof val === "object") {
        if (val.$gte !== undefined && item[key] < val.$gte) return false;
        if (val.$lte !== undefined && item[key] > val.$lte) return false;
        if (val.$gt !== undefined && item[key] <= val.$gt) return false;
        if (val.$lt !== undefined && item[key] >= val.$lt) return false;
        if (val.$regex !== undefined) {
          const regex = new RegExp(val.$regex, val.$options || "");
          return regex.test(item[key]);
        }
        return true;
      }
      
      const itemVal = item[key] && typeof item[key] === "object" && item[key]._id ? item[key]._id : item[key];
      const matchVal = val && typeof val === "object" && val._id ? val._id : val;
      return String(itemVal) === String(matchVal);
    });
  });

  return results;
}

// Populate nested objects
function populateItem(item, path) {
  if (!item) return item;
  const cloned = { ...item };
  if (path === "product") {
    const prodId = cloned.product && typeof cloned.product === "object" ? cloned.product._id : cloned.product;
    cloned.product = collections.Product.find(p => p._id === prodId) || cloned.product;
  }
  if (path === "items.product") {
    if (cloned.items) {
      cloned.items = cloned.items.map(cartItem => {
        const prodId = cartItem.product && typeof cartItem.product === "object" ? cartItem.product._id : cartItem.product;
        return {
          ...cartItem,
          product: collections.Product.find(p => p._id === prodId) || cartItem.product
        };
      });
    }
  }
  if (path === "user") {
    const userId = cloned.user && typeof cloned.user === "object" ? cloned.user._id : cloned.user;
    cloned.user = collections.User.find(u => u._id === userId) || cloned.user;
  }
  return cloned;
}

// Chainable mock Mongoose query builder
class MockQuery {
  constructor(data, modelName, instantiator) {
    this.data = data;
    this.modelName = modelName;
    this.instantiator = instantiator;
  }

  populate(path) {
    if (Array.isArray(this.data)) {
      this.data = this.data.map(item => populateItem(item, path));
    } else if (this.data) {
      this.data = populateItem(this.data, path);
    }
    return this;
  }

  sort(options = {}) {
    if (!Array.isArray(this.data)) return this;
    const [key, direction] = Object.entries(options)[0] || [];
    if (key) {
      this.data.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (typeof valA === "number" && typeof valB === "number") {
          return direction === 1 ? valA - valB : valB - valA;
        }
        return direction === 1 
          ? String(valA).localeCompare(String(valB)) 
          : String(valB).localeCompare(String(valA));
      });
    }
    return this;
  }

  skip(num) {
    if (Array.isArray(this.data)) {
      this.data = this.data.slice(num);
    }
    return this;
  }

  limit(num) {
    if (Array.isArray(this.data)) {
      this.data = this.data.slice(0, num);
    }
    return this;
  }

  then(onResolve, onReject) {
    let resolvedData = this.data;
    if (resolvedData) {
      if (Array.isArray(resolvedData)) {
        resolvedData = resolvedData.map(item => this.instantiator(item));
      } else {
        resolvedData = this.instantiator(resolvedData);
      }
    }
    return Promise.resolve(resolvedData).then(onResolve, onReject);
  }
}

// Generate a Mock model class
export function makeMockModel(modelName) {
  class MockModelInstance {
    constructor(data) {
      Object.assign(this, {
        _id: data && data._id ? data._id : `mock_id_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: data && data.createdAt ? data.createdAt : new Date().toISOString(),
        updatedAt: data && data.updatedAt ? data.updatedAt : new Date().toISOString(),
      }, data);
    }

    async save() {
      const collection = collections[modelName];
      
      // Hash password if User model and password has changed
      if (modelName === "User" && this.password && !this.password.startsWith("$2a$")) {
        this.password = await bcrypt.hash(this.password, 10);
      }

      const index = collection.findIndex(item => item._id === this._id);
      
      // Convert instance to a raw serializable object to store
      const rawData = {};
      Object.keys(this).forEach(key => {
        rawData[key] = this[key];
      });

      if (index >= 0) {
        collection[index] = rawData;
      } else {
        collection.push(rawData);
      }
      saveToFile();
      return this;
    }

    async matchPassword(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    }
  }

  const instantiator = (item) => {
    if (!item) return item;
    if (item instanceof MockModelInstance) return item;
    return new MockModelInstance(item);
  };

  MockModelInstance.find = (query = {}) => {
    let results = filterCollection(collections[modelName], query);
    return new MockQuery(results, modelName, instantiator);
  };

  MockModelInstance.findOne = (query = {}) => {
    let results = filterCollection(collections[modelName], query);
    const item = results.length > 0 ? results[0] : null;
    return new MockQuery(item, modelName, instantiator);
  };

  MockModelInstance.findById = (id) => {
    const item = collections[modelName].find(item => item._id === id || item._id === String(id));
    return new MockQuery(item, modelName, instantiator);
  };

  MockModelInstance.create = async (data) => {
    const instance = new MockModelInstance(data);
    await instance.save();
    return instance;
  };

  MockModelInstance.findByIdAndUpdate = async (id, update, options = {}) => {
    const item = collections[modelName].find(item => item._id === id);
    if (item) {
      const updates = update.$set ? update.$set : update;
      Object.assign(item, updates, { updatedAt: new Date().toISOString() });
      saveToFile();
      return instantiator(item);
    }
    return null;
  };

  MockModelInstance.findByIdAndDelete = async (id) => {
    const index = collections[modelName].findIndex(item => item._id === id);
    if (index >= 0) {
      const removed = collections[modelName].splice(index, 1)[0];
      saveToFile();
      return instantiator(removed);
    }
    return null;
  };

  MockModelInstance.deleteOne = async (query) => {
    const results = filterCollection(collections[modelName], query);
    if (results.length > 0) {
      const index = collections[modelName].findIndex(item => item._id === results[0]._id);
      collections[modelName].splice(index, 1);
      saveToFile();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  };

  MockModelInstance.deleteMany = async (query = {}) => {
    const results = filterCollection(collections[modelName], query);
    results.forEach(res => {
      const index = collections[modelName].findIndex(item => item._id === res._id);
      if (index >= 0) collections[modelName].splice(index, 1);
    });
    saveToFile();
    return { deletedCount: results.length };
  };

  MockModelInstance.countDocuments = async (query = {}) => {
    const results = filterCollection(collections[modelName], query);
    return results.length;
  };

  return MockModelInstance;
}
