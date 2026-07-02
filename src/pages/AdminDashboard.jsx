import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../api/api.js";
import toast from "react-hot-toast";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  Star,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Terminal,
} from "lucide-react";
import Loading from "../components/Loading.jsx";

const AdminDashboard = () => {
  const { user } = useAuth();

  // Active Tab: dashboard, products, orders, categories, users, reviews
  const [activeTab, setActiveTab] = useState("dashboard");

  // State arrays
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Loaders
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    stock: "",
    featured: false,
    specifications: "", // JSON string
    features: "", // Newline-separated list
    image: null,
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // 1. Initial Load of DB records
  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard") {
        const [pRes, oRes, uRes] = await Promise.all([
          apiClient.get("/products?limit=999"),
          apiClient.get("/orders/all"),
          apiClient.get("/auth/users"),
        ]);

        const totalRevenue = oRes.data
          .filter((o) => o.status !== "Cancelled")
          .reduce((sum, order) => sum + order.totalAmount, 0);

        setAnalytics({
          totalOrders: oRes.data.length,
          totalRevenue,
          totalUsers: uRes.data.length,
          totalProducts: pRes.data.total || pRes.data.products?.length || 0,
        });
      } else if (activeTab === "products") {
        const res = await apiClient.get("/products?limit=999");
        setProducts(res.data.products || []);
        const catRes = await apiClient.get("/categories");
        setCategories(catRes.data || []);
      } else if (activeTab === "orders") {
        const res = await apiClient.get("/orders/all");
        setOrders(res.data || []);
      } else if (activeTab === "categories") {
        const res = await apiClient.get("/categories");
        setCategories(res.data || []);
      } else if (activeTab === "users") {
        const res = await apiClient.get("/auth/users");
        setUsers(res.data || []);
      } else if (activeTab === "reviews") {
        const res = await apiClient.get("/reviews/all");
        setReviews(res.data || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // ==================== PRODUCT CRUD OPERATIONS ====================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: "",
      description: "",
      price: "",
      discountPrice: "0",
      category: categories[0]?._id || "",
      brand: "",
      stock: "",
      featured: false,
      specifications: '{\n  "Processor": "",\n  "Memory": "",\n  "Storage": ""\n}',
      features: "",
      image: null,
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      description: prod.description,
      price: prod.price,
      discountPrice: prod.discountPrice || "0",
      category: prod.category?._id || prod.category || "",
      brand: prod.brand,
      stock: prod.stock,
      featured: prod.featured || false,
      specifications: JSON.stringify(prod.specifications, null, 2),
      features: prod.features?.join("\n") || "",
      image: null,
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", productForm.title);
    formData.append("description", productForm.description);
    formData.append("price", productForm.price);
    formData.append("discountPrice", productForm.discountPrice);
    formData.append("category", productForm.category);
    formData.append("brand", productForm.brand);
    formData.append("stock", productForm.stock);
    formData.append("featured", productForm.featured);

    try {
      const parsedSpecs = JSON.parse(productForm.specifications);
      formData.append("specifications", JSON.stringify(parsedSpecs));
    } catch (err) {
      toast.error("Specifications must be a valid JSON object.");
      return;
    }

    const featuresArray = productForm.features
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    
    featuresArray.forEach((feat, index) => {
      formData.append(`features[${index}]`, feat);
    });

    if (productForm.image) {
      formData.append("image", productForm.image);
    }

    const modalToast = toast.loading("Saving product...");
    try {
      if (editingProduct) {
        await apiClient.put(`/products/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!", { id: modalToast });
      } else {
        await apiClient.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added to catalog!", { id: modalToast });
      }
      setShowProductModal(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || "Failed to save product.", {
        id: modalToast,
      });
    }
  };

  const handleDeleteProduct = async (prodId, title) => {
    if (window.confirm(`Delete product: ${title}?`)) {
      const deleteToast = toast.loading("Deleting product...");
      try {
        await apiClient.delete(`/products/${prodId}`);
        toast.success("Product deleted successfully.", { id: deleteToast });
        fetchDashboardData();
      } catch (err) {
        toast.error(err.message || "Failed to delete product.", { id: deleteToast });
      }
    }
  };

  // ==================== CATEGORIES CRUD OPERATIONS ====================
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryName("");
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const catToast = toast.loading("Saving category...");
    try {
      if (editingCategory) {
        await apiClient.put(`/categories/${editingCategory._id}`, { name: categoryName });
        toast.success("Category updated.", { id: catToast });
      } else {
        await apiClient.post("/categories", { name: categoryName });
        toast.success("Category created.", { id: catToast });
      }
      setShowCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || "Failed to save category.", { id: catToast });
    }
  };

  const handleDeleteCategory = async (catId, name) => {
    if (window.confirm(`Delete category: ${name}?`)) {
      try {
        await apiClient.delete(`/categories/${catId}`);
        toast.success("Category deleted.");
        fetchDashboardData();
      } catch (err) {
        toast.error(err.message || "Failed to delete category.");
      }
    }
  };

  // ==================== ORDER STATUS OPERATIONS ====================
  const handleOrderStatusChange = async (orderId, newStatus) => {
    const statusToast = toast.loading("Updating status...");
    try {
      await apiClient.put(`/orders/${orderId}`, { status: newStatus });
      toast.success("Order status updated.", { id: statusToast });
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || "Failed to update order status.", { id: statusToast });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Delete this order record permanently?")) {
      try {
        await apiClient.delete(`/orders/${orderId}`);
        toast.success("Order deleted.");
        fetchDashboardData();
      } catch (err) {
        toast.error(err.message || "Failed to delete order.");
      }
    }
  };

  // ==================== REVIEWS PURGE OPERATION ====================
  const handleDeleteReview = async (revId) => {
    if (window.confirm("Delete this review?")) {
      try {
        await apiClient.delete(`/reviews/${revId}`);
        toast.success("Review deleted.");
        fetchDashboardData();
      } catch (err) {
        toast.error(err.message || "Failed to delete review.");
      }
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-gray-800 font-sans">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Terminal className="w-7 h-7 text-blue-600" />
          <span>Admin Dashboard</span>
        </h1>
      </div>

      {/* Main Grid Floor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar Panel */}
        <aside className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 h-fit space-y-1 shadow-sm text-left">
          {[
            { id: "dashboard", label: "Overview", icon: BarChart3 },
            { id: "products", label: "Products", icon: Package },
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "categories", label: "Categories", icon: FolderOpen },
            { id: "users", label: "Users", icon: Users },
            { id: "reviews", label: "Reviews", icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-none ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Console Panel Details */}
        <main className="lg:col-span-3">
          {loading ? (
            <Loading type="grid" count={3} />
          ) : (
            <div className="animate-fadeIn">
              
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === "dashboard" && (
                <div className="space-y-8 text-left">
                  {/* Metric Counters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Revenue */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-1 shadow-sm">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Net Revenue</span>
                      <h4 className="text-xl md:text-2xl font-bold text-blue-600">
                        {formatMoney(analytics.totalRevenue)}
                      </h4>
                    </div>
                    {/* Orders */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-1 shadow-sm">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900">
                        {analytics.totalOrders}
                      </h4>
                    </div>
                    {/* Users */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-1 shadow-sm">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Users Registry</span>
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900">
                        {analytics.totalUsers}
                      </h4>
                    </div>
                    {/* Products */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-1 shadow-sm">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Products Listed</span>
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900">
                        {analytics.totalProducts}
                      </h4>
                    </div>
                  </div>

                  {/* Diagnostics Banner */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5 space-y-2">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">System Status</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                      Database: <span className="text-green-600">CONNECTED</span> | 
                      Server: <span className="text-green-600">ONLINE</span> | 
                      Fulfillment: <span className="text-blue-600">ACTIVE</span>
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS MANAGER */}
              {activeTab === "products" && (
                <div className="space-y-6 text-left">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">Products Inventory</h3>
                    <button
                      onClick={handleOpenAddProduct}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg font-semibold uppercase transition-colors flex items-center gap-1.5 cursor-pointer border-none shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <p className="text-xs text-gray-400 font-mono">No products listed. Click Add Product to seed details.</p>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-gray-55 border-b border-gray-200 text-gray-500 font-semibold">
                            <th className="p-4 uppercase">Image</th>
                            <th className="p-4 uppercase">Title</th>
                            <th className="p-4 uppercase">Category</th>
                            <th className="p-4 uppercase">Price</th>
                            <th className="p-4 uppercase">Stock</th>
                            <th className="p-4 uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((prod) => (
                            <tr key={prod._id} className="border-b border-gray-150 hover:bg-gray-50/50">
                              <td className="p-4">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-200">
                                  <img src={prod.images?.[0]} alt={prod.title} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="p-4 text-gray-900 font-semibold max-w-[150px] truncate">{prod.title}</td>
                              <td className="p-4 text-gray-500">{prod.category?.name || "Uncategorized"}</td>
                              <td className="p-4 text-blue-600 font-bold">{formatMoney(prod.price)}</td>
                              <td className={`p-4 font-bold ${prod.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                                {prod.stock}
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-blue-600 rounded-lg cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod._id, prod.title)}
                                  className="p-1.5 bg-red-50 border border-red-150 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ORDERS LEDGER */}
              {activeTab === "orders" && (
                <div className="space-y-6 text-left">
                  <h3 className="text-base font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-3">
                    Orders
                  </h3>

                  {orders.length === 0 ? (
                    <p className="text-xs text-gray-400 font-mono">No order receipts located in database logs.</p>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-gray-55 border-b border-gray-200 text-gray-500 font-semibold">
                            <th className="p-4 uppercase">Customer</th>
                            <th className="p-4 uppercase">Date</th>
                            <th className="p-4 uppercase">Total</th>
                            <th className="p-4 uppercase">Status</th>
                            <th className="p-4 uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((ord) => (
                            <tr key={ord._id} className="border-b border-gray-150 hover:bg-gray-50/50">
                              <td className="p-4 text-gray-900">
                                <span className="font-semibold block">{ord.user?.name || "Guest Customer"}</span>
                                <span className="text-[10px] text-gray-400 block">{ord.user?.email || "No Email"}</span>
                              </td>
                              <td className="p-4 text-gray-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                              <td className="p-4 text-blue-600 font-bold">{formatMoney(ord.totalAmount)}</td>
                              <td className="p-4">
                                <select
                                  value={ord.status}
                                  onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                                  className="bg-white border border-gray-200 text-[11px] text-blue-600 focus:outline-none py-1.5 px-2 rounded-lg cursor-pointer shadow-sm focus:border-blue-500"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteOrder(ord._id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-150 text-red-650 rounded-lg cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CATEGORIES CATALOG */}
              {activeTab === "categories" && (
                <div className="space-y-6 text-left">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">Categories</h3>
                    <button
                      onClick={handleOpenAddCategory}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg font-semibold uppercase transition-colors flex items-center gap-1.5 cursor-pointer border-none shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  {categories.length === 0 ? (
                    <p className="text-xs text-gray-400 font-mono">No categories exist. Click Add Category to create.</p>
                  ) : (
                    <div className="max-w-md overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-gray-55 border-b border-gray-200 text-gray-500 font-semibold">
                            <th className="p-4 uppercase">Category Name</th>
                            <th className="p-4 uppercase">Slug</th>
                            <th className="p-4 uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((cat) => (
                            <tr key={cat._id} className="border-b border-gray-150 hover:bg-gray-50/50">
                              <td className="p-4 text-gray-900 font-semibold">{cat.name}</td>
                              <td className="p-4 text-gray-400">{cat.slug}</td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => handleOpenEditCategory(cat)}
                                  className="p-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-blue-600 rounded-lg cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat._id, cat.name)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-150 text-red-650 rounded-lg cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: USER ACCOUNTS */}
              {activeTab === "users" && (
                <div className="space-y-6 text-left">
                  <h3 className="text-base font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-3">
                    Users Directory
                  </h3>

                  {users.length === 0 ? (
                    <p className="text-xs text-gray-400 font-mono">No user records loaded.</p>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-gray-55 border-b border-gray-200 text-gray-500 font-semibold">
                            <th className="p-4 uppercase">Name</th>
                            <th className="p-4 uppercase">Email Address</th>
                            <th className="p-4 uppercase">Phone</th>
                            <th className="p-4 uppercase">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((usr) => (
                            <tr key={usr._id} className="border-b border-gray-150 hover:bg-gray-50/50">
                              <td className="p-4 text-gray-900 font-semibold">{usr.name}</td>
                              <td className="p-4 text-gray-500">{usr.email}</td>
                              <td className="p-4 text-gray-400 font-medium">{usr.phone}</td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    usr.role === "admin"
                                      ? "bg-blue-50 border border-blue-100 text-blue-600"
                                      : "bg-green-50 border border-green-100 text-green-600"
                                  }`}
                                >
                                  {usr.role.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: REVIEW AUDITS */}
              {activeTab === "reviews" && (
                <div className="space-y-6 text-left">
                  <h3 className="text-base font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-3">
                    Reviews Audit
                  </h3>

                  {reviews.length === 0 ? (
                    <p className="text-xs text-gray-400 font-mono">No reviews found.</p>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-gray-55 border-b border-gray-200 text-gray-500 font-semibold">
                            <th className="p-4 uppercase">Reviewer</th>
                            <th className="p-4 uppercase">Product</th>
                            <th className="p-4 uppercase">Rating</th>
                            <th className="p-4 uppercase">Comment</th>
                            <th className="p-4 uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reviews.map((rev) => (
                            <tr key={rev._id} className="border-b border-gray-150 hover:bg-gray-50/50">
                              <td className="p-4 text-gray-900 font-semibold">{rev.user?.name || "Purged User"}</td>
                              <td className="p-4 text-gray-500 max-w-[120px] truncate">{rev.product?.title || "Purged Product"}</td>
                              <td className="p-4 text-amber-500 font-bold">{rev.rating} ★</td>
                              <td className="p-4 text-gray-500 max-w-[200px] truncate font-normal">{rev.comment}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteReview(rev._id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-150 text-red-650 rounded-lg cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </main>
      </div>

      {/* ==================== PRODUCT CREATE/EDIT MODAL ==================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 w-full max-w-2xl rounded-xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-xl animate-scaleUp text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-3">
              {editingProduct ? "Edit Product Details" : "Add Product"}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Brand</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Discount Price */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:bg-white cursor-pointer focus:border-blue-500 transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Level */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] uppercase text-gray-400 font-bold block">Product Image</label>
                  <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.files[0] })}
                      className="text-xs text-gray-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                  {editingProduct && (
                    <span className="text-[10px] text-gray-400 font-normal block mt-1">
                      Leave empty to retain existing image.
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Description</label>
                  <textarea
                    rows="3"
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors font-sans font-normal"
                  ></textarea>
                </div>

                {/* Specifications JSON */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold block">Specifications (JSON format)</label>
                  <textarea
                    rows="4"
                    value={productForm.specifications}
                    onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-850 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors font-mono text-[10px]"
                  ></textarea>
                </div>

                {/* Features Newline-separated */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold block">Bullet Features (one per line)</label>
                  <textarea
                    rows="4"
                    placeholder="CNC aluminum casing&#10;Vapor chamber cooling"
                    value={productForm.features}
                    onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-850 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors text-xs font-normal"
                  ></textarea>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center space-x-2 pt-2 md:col-span-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="accent-blue-600 rounded cursor-pointer w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-[10px] uppercase text-gray-400 font-bold cursor-pointer select-none">
                    Promote to Featured Slider
                  </label>
                </div>

              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-150 pt-4 text-xs">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="bg-white hover:bg-gray-50 text-gray-500 py-2 px-4 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer border-none shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CATEGORY CREATE/EDIT MODAL ==================== */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-sm rounded-xl p-6 space-y-6 relative shadow-xl text-left">
            <h3 className="text-sm font-bold uppercase text-gray-900 border-b border-gray-150 pb-2">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>

            <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 font-bold">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="Laptops"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="bg-white hover:bg-gray-50 text-gray-500 py-2 px-3 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer border-none shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
