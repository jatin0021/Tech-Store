import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import apiClient from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";

const Wishlist = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Wishlist Items on Mount
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    apiClient
      .get("/wishlist")
      .then((res) => {
        if (active) {
          setWishlist(res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load wishlist:", err);
        if (active) {
          toast.error(err.message || "Failed to load wishlist from server.");
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Remove Item from Wishlist
  const handleRemove = async (productId, title) => {
    try {
      const res = await apiClient.delete(`/wishlist/${productId}`);
      setWishlist(res.data);
      toast.success(`${title} removed from wishlist.`);
    } catch (err) {
      toast.error(err.message || "Failed to remove item.");
    }
  };

  // Add Item to Cart and notify
  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product, 1);
      toast.success(`Added ${product.title} to your cart!`);
    } else {
      toast.error("Sorry, this item is out of stock.");
    }
  };

  // Format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return <Loading type="grid" count={3} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          My Wishlist
        </h1>
        <Link to="/collections" className="text-xs text-gray-400 hover:text-blue-600 font-sans tracking-wide font-semibold transition-colors uppercase flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Keep Shopping</span>
        </Link>
      </div>

      {wishlist.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="p-6 bg-blue-50 rounded-full border border-blue-100 text-blue-600">
            <Heart className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider font-sans">Your Wishlist is Empty</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              You haven't saved any hardware products to your wishlist yet.
            </p>
          </div>
          <Link
            to="/collections"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-sans text-sm px-6 py-3 rounded-lg font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm border-none block"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => {
            const hasDiscount = product.discountPrice > 0;
            const currentPrice = hasDiscount ? product.discountPrice : product.price;

            return (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden p-4 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all duration-150"
              >
                {/* Image & Price */}
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50 border border-gray-150 flex items-center justify-center">
                    <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover" />
                    {product.stock === 0 && (
                      <span className="absolute top-2.5 left-2.5 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 shadow-sm uppercase">
                        Out of Stock
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="absolute top-2.5 right-2.5 bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100 shadow-sm uppercase">
                        Sale
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                      {product.brand}
                    </span>
                    <Link to={`/product/${product._id}`} className="hover:text-blue-600 transition-colors">
                      <h4 className="text-base font-semibold text-gray-900 line-clamp-1">{product.title}</h4>
                    </Link>
                  </div>

                  {/* Prices */}
                  <div className="flex items-baseline space-x-2 justify-start">
                    <span className="text-lg font-bold text-gray-905">{formatMoney(currentPrice)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">{formatMoney(product.price)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleRemove(product._id, product.title)}
                    className="flex items-center justify-center space-x-1.5 p-2 bg-red-50 hover:bg-red-100 border border-red-150 text-red-650 rounded-lg text-xs font-semibold uppercase transition-all duration-150 cursor-pointer shadow-sm"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex items-center justify-center space-x-1.5 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-200 disabled:shadow-none text-white rounded-lg text-xs font-bold uppercase transition-all duration-150 cursor-pointer border-none shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
