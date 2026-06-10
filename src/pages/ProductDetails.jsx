import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, PRODUCTS } from "../data/product.js";
import { useCart } from "../context/CartContext.jsx";
import Loading from "../components/Loading.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ArrowLeft, Star, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw } from "lucide-react";

// Mock reviews list to display dynamically
const MOCK_REVIEWS = [
  { id: 1, user: "Alex_Netrunner", rating: 5, date: "2026-05-12", comment: "Absolutely insane performance. Stays cool even under heavy compiled docker structures. Worth every penny." },
  { id: 2, user: "Kaelen.Dev", rating: 4, date: "2026-05-28", comment: "Insanely fast. Screen is unmatched. The only downside is the charging brick size, but GaN technology makes up for it." },
  { id: 3, user: "Sora_Core", rating: 5, date: "2026-06-02", comment: "Flawless configuration. The matrix sync works immediately with my home hub setup." },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // State
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch product on mounting or ID change
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setQuantity(1); // Reset quantity selector
    
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to locate product signature.");
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <Loading type="details" />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-red-400 font-mono text-base uppercase">Error: {error || "Signature mismatch."}</p>
        <Link to="/" className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-350 font-mono text-sm uppercase">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  const { name, price, rating, reviewsCount, description, image, stock, category, specifications, features } = product;

  // Add to cart click handler
  const handleAddToCart = () => {
    if (stock > 0) {
      addToCart(product, quantity);
      alert(`Added ${quantity} unit(s) of ${name} to your cart!`);
    }
  };

  // Get related products in the same category (excluding current product)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === category && p.id !== product.id
  ).slice(0, 3);

  // Format currency
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-orange-400 transition-colors font-mono text-xs uppercase tracking-wider">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Node Grid</span>
      </Link>

      {/* Grid Layout (Splits image & summary info) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Product Visuals */}
        <div className="bg-gray-950/40 border border-gray-900 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center border border-gray-900">
            <img src={image} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent"></div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 font-mono px-2">
            <span>Hardware Category: <span className="text-orange-400 uppercase font-bold">{category}</span></span>
            <span>SKU ID: 00{id}-TECH</span>
          </div>
        </div>

        {/* Right Column: Buying Deck & Specs Info */}
        <div className="space-y-6">
          
          {/* Badge & Title */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {stock > 0 ? (
                <span className="bg-emerald-500/10 border border-emerald-500/35 px-2.5 py-1 rounded-full text-[10px] text-emerald-400 font-mono uppercase font-bold tracking-wider">
                  System Online (In Stock)
                </span>
              ) : (
                <span className="bg-red-500/10 border border-red-500/35 px-2.5 py-1 rounded-full text-[10px] text-red-400 font-mono uppercase font-bold tracking-wider">
                  Depleted (Out of Stock)
                </span>
              )}
              {stock <= 5 && stock > 0 && (
                <span className="text-orange-400 font-mono text-xs animate-pulse font-bold">
                  Warning: Only {stock} units left!
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider">{name}</h1>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-orange-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? "fill-orange-400 text-orange-400"
                      : "text-gray-800"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 font-bold">{rating} stars</span>
            <span className="text-gray-700">|</span>
            <span className="text-xs text-gray-500 font-mono uppercase">{reviewsCount} Database Audits</span>
          </div>

          {/* Price Tag */}
          <div className="text-3xl font-extrabold font-mono text-white tracking-widest">{formattedPrice}</div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

          {/* Selection Module */}
          <div className="bg-gray-950/50 border border-gray-900 rounded-3xl p-6 space-y-4">
            
            {stock > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono uppercase text-gray-500">Unit Quantity</span>
                
                {/* Custom quantity selection widget */}
                <div className="flex items-center space-x-1.5 bg-gray-900/60 p-1 rounded-2xl border border-gray-850">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      quantity <= 1 ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-white text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      quantity >= stock ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:text-white"
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
                className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-mono text-sm py-4 rounded-2xl font-bold uppercase transition-all duration-150 flex items-center justify-center space-x-2.5 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 border border-orange-400/20 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Initialize Add to Cart</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-900 text-gray-600 border border-gray-850 font-mono text-sm py-4 rounded-2xl font-bold uppercase cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Hardware Depleted</span>
              </button>
            )}

          </div>

          {/* Quick trust metrics */}
          <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-gray-900/40 text-[10px] text-gray-500 uppercase font-mono">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>Full Warranty</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>Secure Dispatch</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <RefreshCw className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>30 Day Swap</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Tabbed Information Deck (Specs / Reviews / Overview) */}
      <section className="bg-gray-950/20 border border-gray-900 rounded-3xl p-6 md:p-8 space-y-6">
        
        {/* Tab Buttons */}
        <div className="flex space-x-4 border-b border-gray-900 pb-2 overflow-x-auto">
          {["overview", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-mono text-xs uppercase font-bold tracking-widest transition-colors cursor-pointer border-b-2 px-1 whitespace-nowrap ${
                activeTab === tab
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-gray-500 hover:text-white"
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
                <li key={idx} className="flex items-start space-x-3 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "specifications" && (
            <div className="overflow-x-auto border border-gray-900 rounded-2xl bg-gray-950/40">
              <table className="w-full text-left border-collapse text-sm">
                <tbody>
                  {Object.entries(specifications || {}).map(([key, val], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? "bg-gray-900/10" : "bg-gray-950/20"}>
                      <td className="p-4 font-mono text-xs uppercase text-gray-500 font-bold w-1/3 border-b border-gray-900">
                        {key}
                      </td>
                      <td className="p-4 text-white font-mono text-xs border-b border-gray-900">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {MOCK_REVIEWS.map((rev) => (
                <div key={rev.id} className="p-5 bg-gray-950/30 border border-gray-900 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-orange-400 font-bold">{rev.user}</span>
                    <span className="text-gray-500">{rev.date}</span>
                  </div>
                  <div className="flex text-orange-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-orange-400 text-orange-400" : "text-gray-800"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* 5. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <h3 className="text-xl font-bold uppercase tracking-wider text-white border-l-3 border-orange-500 pl-3">
            Related Hardware Nodes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;