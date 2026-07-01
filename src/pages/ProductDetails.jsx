import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/Loading.jsx";
import ProductCard from "../components/ProductCard.jsx";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  Edit2,
  Trash2,
  Send,
  MessageSquareHeart,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // State variables
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  // Image Gallery states
  const [activeImage, setActiveImage] = useState("");
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  // Reviews submission forms state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Dynamic lists from DB
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // 1. Fetch product, set viewed tracking, find category relations
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    setQuantity(1);
    setEditingReviewId(null);
    setCommentInput("");

    apiClient
      .get(`/products/${id}`)
      .then((res) => {
        if (!active) return;
        const data = res.data;
        setProduct(data);
        setActiveImage(data.images?.[0] || "");
        setIsLoading(false);

        // Track recently viewed product logic
        trackRecentlyViewed(data);

        // Fetch related products of the same category
        const catId = data.category?._id || data.category;
        apiClient
          .get(`/products?category=${catId}&limit=4`)
          .then((relRes) => {
            if (active) {
              const list = relRes.data.products || [];
              // Exclude current product
              setRelatedProducts(list.filter((p) => p._id !== data._id).slice(0, 3));
            }
          })
          .catch((err) => console.error("Failed to load related products:", err));
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to locate product signature.");
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tech_store_recently_viewed");
      if (saved) {
        setRecentlyViewed(JSON.parse(saved).filter((p) => p._id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  // 2. LocalStorage viewed tracking helper
  const trackRecentlyViewed = (prod) => {
    try {
      const saved = localStorage.getItem("tech_store_recently_viewed");
      let list = saved ? JSON.parse(saved) : [];
      
      // Filter out existing instances of this product
      list = list.filter((item) => item._id !== prod._id);
      
      // Push current to top
      const snapshot = {
        _id: prod._id,
        title: prod.title,
        images: prod.images,
        price: prod.price,
        discountPrice: prod.discountPrice,
        rating: prod.rating,
        category: prod.category,
        brand: prod.brand,
      };

      list.unshift(snapshot);
      // Keep only last 4 elements
      list = list.slice(0, 4);

      localStorage.setItem("tech_store_recently_viewed", JSON.stringify(list));
    } catch (e) {
      console.error("Viewed tracking error:", e);
    }
  };

  // Image zoom mover
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  // Cart Add click handler
  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} unit(s) of ${product.title} to your cart!`);
    }
  };

  // ==================== REVIEWS LOGIC FLOW ====================
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }

    setIsSubmittingReview(true);
    const reviewToast = toast.loading("Recording review details...");
    try {
      if (editingReviewId) {
        const res = await apiClient.put(`/reviews/${editingReviewId}`, {
          rating: ratingInput,
          comment: commentInput,
        });

        setProduct((prev) => ({
          ...prev,
          reviews: prev.reviews.map((r) =>
            r._id === editingReviewId ? res.data : r
          ),
        }));

        toast.success("Review update synchronized!", { id: reviewToast });
        setEditingReviewId(null);
      } else {
        const res = await apiClient.post("/reviews", {
          productId: product._id,
          rating: ratingInput,
          comment: commentInput,
        });

        setProduct((prev) => ({
          ...prev,
          reviews: [res.data, ...prev.reviews],
        }));

        toast.success("Review recorded! Average rating recomputed.", { id: reviewToast });
      }

      const updatedProd = await apiClient.get(`/products/${product._id}`);
      setProduct((prev) => ({
        ...prev,
        rating: updatedProd.data.rating,
        reviewsCount: updatedProd.data.reviewsCount,
      }));

      setCommentInput("");
    } catch (err) {
      toast.error(err.message || "Failed to post review.", {
        id: reviewToast,
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (revId) => {
    if (window.confirm("Purge review audit details?")) {
      const deleteToast = toast.loading("Purging review audit...");
      try {
        await apiClient.delete(`/reviews/${revId}`);
        
        setProduct((prev) => ({
          ...prev,
          reviews: prev.reviews.filter((r) => r._id !== revId),
        }));

        toast.success("Review deleted successfully.", { id: deleteToast });

        const updatedProd = await apiClient.get(`/products/${product._id}`);
        setProduct((prev) => ({
          ...prev,
          rating: updatedProd.data.rating,
          reviewsCount: updatedProd.data.reviewsCount,
        }));
      } catch (err) {
        toast.error(err.message || "Failed to delete review.", { id: deleteToast });
      }
    }
  };

  const handleEditClick = (rev) => {
    setEditingReviewId(rev._id);
    setRatingInput(rev.rating);
    setCommentInput(rev.comment);
    setActiveTab("reviews");
  };

  if (isLoading) {
    return <Loading type="details" />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-red-500 font-mono text-base uppercase">Error: {error || "Signature mismatch."}</p>
        <Link to="/" className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-mono text-sm uppercase">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  const { title, price, discountPrice, rating, reviewsCount, description, images, stock, category, specifications, features, reviews } = product;

  const hasDiscount = discountPrice > 0;
  const currentPrice = hasDiscount ? discountPrice : price;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const userHasReview = reviews?.find(
    (r) => r.user?._id === user?._id || r.user === user?._id
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 animate-fadeIn text-stone-800">
      
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center space-x-2 text-stone-400 hover:text-orange-600 transition-colors font-mono text-xs uppercase tracking-wider">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Node Grid</span>
      </Link>

      {/* Grid Layout (Splits image gallery & details info) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Product Visual Gallery */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-100 rounded-[28px] p-6 shadow-sm space-y-4">
            
            {/* Main Interactive Zoom Image */}
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-stone-50 flex items-center justify-center border border-stone-100 cursor-zoom-in"
            >
              <img
                src={activeImage}
                alt={title}
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? "scale(1.8)" : "scale(1)",
                }}
                className="w-full h-full object-cover transition-transform duration-100 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/5 to-transparent pointer-events-none"></div>
            </div>

            {/* Gallery Thumbnail Slider */}
            {images?.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden bg-stone-50 border flex-shrink-0 cursor-pointer ${
                      activeImage === img ? "border-orange-600" : "border-stone-200"
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono px-2">
              <span>Category: <span className="text-orange-600 uppercase font-bold">{category?.name || "Uncategorized"}</span></span>
              <span>SKU ID: {product._id?.substring(18).toUpperCase()}-TECH</span>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Checkout module */}
        <div className="space-y-6 text-left">
          
          {/* Badge & Title */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {stock > 0 ? (
                <span className="bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full text-[10px] text-emerald-600 font-sans uppercase font-bold tracking-wider">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-50 border border-red-105 px-2.5 py-1 rounded-full text-[10px] text-red-600 font-sans uppercase font-bold tracking-wider">
                  Out of Stock
                </span>
              )}

              {stock <= 5 && stock > 0 && (
                <span className="text-amber-655 font-semibold text-xs animate-pulse">
                  Only {stock} units left!
                </span>
              )}

              {hasDiscount && (
                <span className="bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-600 font-bold px-2.5 py-1 rounded-full uppercase">
                  Save {formatMoney(price - discountPrice)}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-tight">
              {title}
            </h1>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-stone-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-stone-500 font-bold font-mono">{rating} stars</span>
            <span className="text-stone-200">|</span>
            <span className="text-xs text-stone-400 font-mono uppercase">{reviewsCount} Database Audits</span>
          </div>

          {/* Price Tag */}
          <div className="flex items-baseline space-x-3 font-mono">
            <span className="text-3xl font-black text-stone-905 tracking-tight">{formatMoney(currentPrice)}</span>
            {hasDiscount && (
              <span className="text-sm text-stone-450 line-through">{formatMoney(price)}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-stone-500 text-sm leading-relaxed font-sans">{description}</p>

          {/* Selection Module */}
          <div className="bg-white border border-stone-100 rounded-[28px] p-6 space-y-4 shadow-sm">
            
            {stock > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-405 tracking-wider">Unit Quantity</span>
                
                {/* Custom quantity selectors */}
                <div className="flex items-center space-x-1.5 bg-stone-50 p-1 rounded-2xl border border-stone-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      quantity <= 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-stone-850 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      quantity >= stock ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTA add button */}
            {stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs py-4 rounded-2xl font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-2 shadow-sm hover:shadow cursor-pointer border border-orange-500/20"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Initialize Add to Cart</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-stone-50 text-stone-400 border border-stone-100 text-xs py-4 rounded-2xl font-bold uppercase cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Hardware Depleted</span>
              </button>
            )}

          </div>

          {/* Quick trust metrics */}
          <div className="grid grid-cols-3 gap-2 py-4 border border-stone-100 rounded-2xl p-4 bg-white text-[10px] text-stone-500 uppercase font-bold tracking-wider shadow-sm">
            <div className="flex items-center space-x-1.5 justify-center border-r border-stone-100">
              <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span>Full Warranty</span>
            </div>
            <div className="flex items-center space-x-1.5 justify-center border-r border-stone-100">
              <Truck className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span>Secure Dispatch</span>
            </div>
            <div className="flex items-center space-x-1.5 justify-center">
              <RefreshCw className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span>30 Day Swap</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Tabbed Information Deck (Specs / Reviews / Overview) */}
      <section className="bg-white border border-stone-100 rounded-[28px] p-6 md:p-8 space-y-6 shadow-sm text-left">
        
        {/* Tab Buttons */}
        <div className="flex space-x-4 border-b border-stone-100 pb-2 overflow-x-auto">
          {["overview", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer border-b-2 px-1 whitespace-nowrap ${
                activeTab === tab
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-stone-405 hover:text-stone-705"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === "overview" && (
            <ul className="space-y-4">
              {features?.map((feat, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-stone-600">
                  <Check className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
              {(!features || features.length === 0) && (
                <p className="text-xs text-stone-400 font-mono">No special features listed for this node.</p>
              )}
            </ul>
          )}

          {activeTab === "specifications" && (
            <div className="overflow-x-auto border border-stone-100 rounded-2xl bg-stone-50/50">
              <table className="w-full text-left border-collapse text-sm">
                <tbody>
                  {Object.entries(specifications || {}).map(([key, val], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? "bg-stone-50/30" : "bg-white"}>
                      <td className="p-4 font-bold text-xs uppercase text-stone-500 w-1/3 border-b border-stone-100">
                        {key}
                      </td>
                      <td className="p-4 text-stone-700 text-xs border-b border-stone-100">
                        {val}
                      </td>
                    </tr>
                  ))}
                  {(!specifications || Object.keys(specifications).length === 0) && (
                    <tr>
                      <td className="p-4 text-xs text-stone-450 font-mono">No custom specifications cataloged.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              
              {/* Dynamic Review Submission Box */}
              {isAuthenticated ? (
                (!userHasReview || editingReviewId) ? (
                  <form onSubmit={handleReviewSubmit} className="p-6 bg-stone-50/50 border border-stone-200/80 rounded-3xl space-y-4 max-w-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-orange-655 flex items-center gap-1.5">
                      <MessageSquareHeart className="w-4 h-4 text-orange-600" />
                      <span>{editingReviewId ? "Update Review Details" : "Record Review Details"}</span>
                    </h4>

                    {/* Star selection widget */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase text-stone-400 font-bold">Star Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingInput(star)}
                            className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-6 h-6 ${star <= ratingInput ? "fill-amber-400" : "text-stone-200"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment text */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase text-stone-400 font-bold">Audit Comment</label>
                      <textarea
                        rows="3"
                        required
                        placeholder="Write your review..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="w-full bg-white border border-stone-200 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-xs text-stone-800 focus:outline-none"
                      ></textarea>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs py-2.5 px-5 rounded-2xl font-bold uppercase transition-colors cursor-pointer flex items-center space-x-1.5 border border-orange-500/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{editingReviewId ? "Sync Details" : "Submit Details"}</span>
                      </button>
                      {editingReviewId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReviewId(null);
                            setCommentInput("");
                            setRatingInput(5);
                          }}
                          className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-400 text-xs py-2.5 px-4 rounded-2xl transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="p-4 bg-orange-50 border border-orange-100/50 rounded-2xl text-[11px] text-orange-655 uppercase font-bold">
                    You have already submitted a review for this product. You can update or delete it below.
                  </div>
                )
              ) : (
                <div className="p-5 bg-stone-50 border border-stone-100 rounded-2xl text-xs text-stone-400 flex justify-between items-center font-mono">
                  <span>Authentication required to submit review.</span>
                  <Link to="/login" className="text-orange-600 font-bold uppercase hover:text-orange-500">Login Profile</Link>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((rev) => {
                    const isOwnReview = rev.user?._id === user?._id || rev.user === user?._id;
                    const reviewerName = rev.user?.name || "Purged User";
                    const isOwnerOrAdmin = isOwnReview || user?.role === "admin";

                    return (
                      <div key={rev._id} className="p-5 bg-stone-50/30 border border-stone-100 rounded-2xl space-y-3 relative">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-800 font-bold">{reviewerName}</span>
                          <span className="text-stone-400 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                          ))}
                        </div>
                        <p className="text-sm text-stone-600 leading-relaxed font-sans">{rev.comment}</p>

                        {/* Edit/Delete control tags for owners and admin */}
                        {isOwnerOrAdmin && (
                          <div className="absolute bottom-5 right-5 flex space-x-2">
                            {isOwnReview && (
                              <button
                                onClick={() => handleEditClick(rev)}
                                className="p-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg text-orange-600 cursor-pointer"
                                title="Edit review"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(rev._id)}
                              className="p-1.5 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg text-red-600 cursor-pointer"
                              title="Delete review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-400 font-mono">No reviews are currently cataloged for this node.</p>
                )}
              </div>
            </div>
          )}
        </div>

      </section>

      {/* 5. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4 text-left">
          <h3 className="text-xl font-bold uppercase tracking-tight text-stone-850 border-l-4 border-orange-500 pl-3">
            Related Hardware Nodes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-stone-100 text-left">
          <h3 className="text-xl font-bold uppercase tracking-tight text-stone-850 border-l-4 border-orange-500 pl-3">
            Recently Viewed Nodes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;