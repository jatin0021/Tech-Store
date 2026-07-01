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
      toast.error("Sorry, this hardware signature is out of stock.");
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-stone-800">
      {/* Header */}
      <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 font-sans-title">
          Wishlist <span className="text-orange-600 font-sans-title">Inventory</span>
        </h1>
        <Link to="/" className="text-xs text-stone-400 hover:text-orange-655 font-mono transition-colors uppercase flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Catalog</span>
        </Link>
      </div>

      {wishlist.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-stone-200 rounded-3xl bg-white shadow-sm">
          <div className="p-6 bg-orange-50 rounded-full border border-orange-100 text-orange-655">
            <Heart className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-stone-850 uppercase tracking-wider">Wishlist Matrix Empty</h2>
            <p className="text-sm text-stone-500 max-w-sm">
              You haven't locked any hardware signatures to your wishlist buffer yet.
            </p>
          </div>
          <Link
            to="/"
            className="bg-orange-600 hover:bg-orange-700 active:bg-orange-850 text-white font-mono text-xs px-6 py-3.5 rounded-2xl font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm"
          >
            Query Hardware Catalog
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
                className="bg-white border border-stone-100 hover:border-orange-500/20 rounded-[28px] overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow transition-all duration-200"
              >
                {/* Image & Price */}
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 flex items-center justify-center">
                    <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover" />
                    {product.stock === 0 && (
                      <span className="absolute top-3 left-3 bg-red-50 text-red-655 text-[9px] font-bold px-2 py-0.5 rounded border border-red-105 shadow-sm uppercase">
                        Out of Stock
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 shadow-sm uppercase">
                        Clearance
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-orange-605 font-bold uppercase tracking-wider block">
                      {product.brand}
                    </span>
                    <Link to={`/product/${product._id}`} className="hover:text-orange-600 transition-colors">
                      <h4 className="text-base font-bold text-stone-850 line-clamp-1">{product.title}</h4>
                    </Link>
                  </div>

                  {/* Prices */}
                  <div className="flex items-baseline space-x-2 font-mono justify-start">
                    <span className="text-lg font-bold text-stone-905">{formatMoney(currentPrice)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-stone-400 line-through">{formatMoney(product.price)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => handleRemove(product._id, product.title)}
                    className="flex items-center justify-center space-x-2 p-2.5 bg-red-50 hover:bg-red-100 border border-red-105 text-red-650 rounded-2xl text-xs font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm"
                    title="Purge signature"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Purge</span>
                  </button>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex items-center justify-center space-x-2 p-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-50 disabled:text-stone-300 disabled:border-stone-100 disabled:shadow-none text-white rounded-2xl text-xs font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm border border-orange-500/20"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Load</span>
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
