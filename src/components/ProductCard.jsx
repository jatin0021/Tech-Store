import { Star, ShoppingCart, Info, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../api/api.js";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Map backend variables
  const id = product._id || product.id;
  const name = product.title || product.name;
  const image = product.images?.[0] || product.image;
  const category = product.category?.name || product.category;
  
  const { price, discountPrice, rating, reviewsCount, stock } = product;
  const hasDiscount = discountPrice > 0;
  const currentPrice = hasDiscount ? discountPrice : price;

  // Handle Add To Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addToCart(product, 1);
      toast.success(`Added ${name} to your cart!`);
    }
  };

  // Handle Add to Wishlist
  const handleAddWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to save to your wishlist.");
      return;
    }
    try {
      await apiClient.post("/wishlist", { productId: id });
      toast.success(`Added ${name} to your wishlist!`);
    } catch (err) {
      toast.error(err.message || "Failed to add to wishlist.");
    }
  };

  // Format price
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(currentPrice);

  return (
    <Link to={`/product/${id}`} className="group block text-left">
      <div className="relative bg-white border border-stone-100 group-hover:border-orange-500/20 rounded-[28px] p-5 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md hover:-translate-y-1">
        
        {/* Product Image Panel */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-50 mb-4 flex items-center justify-center border border-stone-100">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/5 via-transparent to-transparent opacity-40"></div>
          
          {/* Category Chip */}
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[9px] text-orange-600 font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-stone-200/50 shadow-sm">
            {category}
          </span>

          {/* Wishlist Icon */}
          <button
            onClick={handleAddWishlist}
            className="absolute bottom-3 right-3 p-2 bg-white/95 backdrop-blur-md rounded-xl border border-stone-200 hover:border-orange-500/30 text-stone-400 hover:text-orange-655 shadow-sm transition-colors cursor-pointer"
            title="Lock to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Stock Status / Discount Badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            {stock === 0 ? (
              <span className="bg-red-50 text-red-655 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-100 shadow-sm">
                Out Of Stock
              </span>
            ) : stock <= 5 ? (
              <span className="bg-amber-50 text-amber-655 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-100 shadow-sm animate-pulse">
                Limit {stock}
              </span>
            ) : null}

            {hasDiscount && (
              <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100 shadow-sm">
                Clearance
              </span>
            )}
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-1.5">
            {/* Reviews & Ratings */}
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-stone-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-stone-400 font-mono">
                ({reviewsCount})
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-stone-850 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1">
              {name}
            </h3>
          </div>

          {/* Bottom Buy Block */}
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-stone-100">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-stone-900 font-mono leading-none">
                {formattedPrice}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-stone-400 line-through font-mono mt-1">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)}
                </span>
              )}
            </div>

            {stock === 0 ? (
              <button
                disabled
                className="bg-stone-50 text-stone-400 px-3.5 py-2.5 rounded-2xl cursor-not-allowed flex items-center space-x-2 border border-stone-100 text-xs font-bold font-mono"
              >
                <Info className="w-4 h-4" />
                <span>N/A</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-2xl transition-all duration-150 flex items-center space-x-2 shadow-sm shadow-orange-600/10 cursor-pointer border border-orange-500/20"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline font-mono font-bold text-xs uppercase tracking-wider">BUY</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;