import { Star, ShoppingCart, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { id, name, price, rating, reviewsCount, image, stock, category } = product;

  // Handle Add To Cart and prevent page redirecting
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addToCart(product, 1);
      alert(`Added ${name} to your cart!`);
    }
  };

  // Format price
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative bg-gray-950/40 backdrop-blur-sm border border-gray-900 group-hover:border-orange-500/30 rounded-3xl p-5 transition-all duration-300 flex flex-col h-full shadow-lg group-hover:shadow-2xl group-hover:shadow-orange-950/20 hover:-translate-y-1">
        
        {/* Product Image Panel */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900/50 mb-4 flex items-center justify-center">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60"></div>
          
          {/* Category Chip */}
          <span className="absolute top-3 left-3 bg-gray-950/80 backdrop-blur-md text-[10px] text-orange-400 font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-500/20">
            {category}
          </span>

          {/* Stock Status Chip */}
          {stock === 0 ? (
            <span className="absolute top-3 right-3 bg-red-950/80 backdrop-blur-md text-[10px] text-red-400 font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-500/20">
              Sold Out
            </span>
          ) : stock <= 5 ? (
            <span className="absolute top-3 right-3 bg-orange-950/80 backdrop-blur-md text-[10px] text-orange-400 font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-500/20 animate-pulse">
              Limit {stock}
            </span>
          ) : null}
        </div>

        {/* Info Area */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            {/* Reviews & Ratings */}
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center text-orange-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(rating)
                        ? "fill-orange-400 text-orange-400"
                        : "text-gray-800"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-mono">
                ({reviewsCount})
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200 line-clamp-1">
              {name}
            </h3>
          </div>

          {/* Bottom Buy Block */}
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-900/60">
            <span className="text-xl font-extrabold text-white font-mono">
              {formattedPrice}
            </span>

            {stock === 0 ? (
              <button
                disabled
                className="bg-gray-900 text-gray-600 px-3.5 py-2.5 rounded-2xl cursor-not-allowed flex items-center space-x-2 border border-gray-800 text-sm font-bold font-mono"
              >
                <Info className="w-4 h-4" />
                <span>N/A</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-2xl transition-all duration-150 flex items-center space-x-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 border border-orange-400/20 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline font-bold font-mono text-sm">BUY</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;