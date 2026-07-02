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
      <div className="relative bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md hover:-translate-y-1">
        
        {/* Product Image Panel */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-50 mb-4 flex items-center justify-center border border-gray-100">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 via-transparent to-transparent opacity-40"></div>
          
          {/* Category Chip */}
          <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-[10px] text-gray-700 font-semibold px-2 py-0.5 rounded uppercase tracking-wider border border-gray-200/50 shadow-sm">
            {category}
          </span>

          {/* Wishlist Icon */}
          <button
            onClick={handleAddWishlist}
            className="absolute bottom-2.5 right-2.5 p-2 bg-white/95 backdrop-blur-md rounded-lg border border-gray-250 text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-colors cursor-pointer"
            title="Add to Wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Stock Status / Discount Badges */}
          <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
            {stock === 0 ? (
              <span className="bg-red-50 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-100 shadow-sm">
                Out Of Stock
              </span>
            ) : stock <= 5 ? (
              <span className="bg-amber-50 text-amber-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-100 shadow-sm">
                Only {stock} Left
              </span>
            ) : null}

            {hasDiscount && (
              <span className="bg-green-50 text-green-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-green-100 shadow-sm">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-1">
            {/* Reviews & Ratings */}
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                ({reviewsCount})
              </span>
            </div>

            {/* Title */}
            <h3 className="text-[17px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-150 line-clamp-1">
              {name}
            </h3>
          </div>

          {/* Bottom Buy Block */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-[20px] font-bold text-gray-900 leading-none">
                {formattedPrice}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through mt-1">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)}
                </span>
              )}
            </div>

            {stock === 0 ? (
              <button
                disabled
                className="bg-gray-100 text-gray-400 px-3.5 py-2 rounded-lg cursor-not-allowed flex items-center space-x-1 border border-gray-200 text-xs font-semibold"
              >
                <Info className="w-3.5 h-3.5" />
                <span>N/A</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer border-none shadow-sm font-semibold text-xs uppercase"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;