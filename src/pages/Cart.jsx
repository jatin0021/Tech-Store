import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import CartItem from "../components/CartItem.jsx";
import { ShoppingCart, ArrowRight, ArrowLeft, Tag, Info, Trash2 } from "lucide-react";

const Cart = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Promo Code State
  const [promoInput, setPromoInput] = useState("");
  const [discountRate, setDiscountRate] = useState(0); // e.g. 0.10 for 10%
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Load applied coupon from session or keep simple
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const code = promoInput.trim().toUpperCase();
    if (code === "TECH10") {
      setDiscountRate(0.10);
      setPromoSuccess("Coupon Applied: 10% matrix discount credited!");
    } else if (code === "") {
      setPromoError("Please enter a code.");
    } else {
      setPromoError("Invalid clearance code.");
    }
  };

  // Shipping Calculations (Free shipping over $500, else $15)
  const shippingCost = cartSubtotal >= 500 ? 0 : cartSubtotal > 0 ? 15.00 : 0;
  
  // Tax Calculations (Estimated 8%)
  const taxCost = cartSubtotal * 0.08;

  // Discount Calculation
  const discountCost = cartSubtotal * discountRate;

  // Final Total
  const finalTotal = cartSubtotal + shippingCost + taxCost - discountCost;

  // Format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-gray-900/60 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider">
          Shopping Cart <span className="text-orange-400">Deck</span>
        </h1>
        <Link to="/" className="text-xs text-gray-500 hover:text-orange-400 font-mono transition-colors uppercase flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Keep Browsing</span>
        </Link>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-gray-900 rounded-3xl bg-gray-950/10">
          <div className="p-6 bg-orange-500/5 rounded-full border border-orange-500/20 text-orange-400">
            <ShoppingCart className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Cart Matrix Empty</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Your active checkout buffer is currently empty. Query the hardware store to load items.
            </p>
          </div>
          <Link
            to="/"
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-mono text-sm px-6 py-3.5 rounded-2xl font-bold uppercase transition-all duration-150 cursor-pointer shadow-lg shadow-orange-500/20"
          >
            Explore System Catalog
          </Link>
        </div>
      ) : (
        /* Cart Active List */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            
            {/* Clear Cart Button */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to purge the cart buffer?")) {
                  clearCart();
                }
              }}
              className="inline-flex items-center space-x-2 text-xs text-gray-600 hover:text-red-400 transition-colors font-mono uppercase cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Cart Buffer</span>
            </button>
          </div>

          {/* Right Side: Price Details Card */}
          <div className="space-y-6">
            
            {/* Summary Box */}
            <div className="bg-gray-950/40 border border-gray-900 rounded-3xl p-6 space-y-6">
              <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white border-b border-gray-900 pb-3">
                Order Invoice
              </h3>

              {/* Price Rows */}
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-white">{formatMoney(cartSubtotal)}</span>
                </div>
                
                {discountCost > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Matrix Promo (10%)</span>
                    <span>-{formatMoney(discountCost)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>Priority Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-400 uppercase font-bold text-xs">FREE DISPATCH</span>
                  ) : (
                    <span className="text-white">{formatMoney(shippingCost)}</span>
                  )}
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white">{formatMoney(taxCost)}</span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-[10px] text-gray-600 flex items-start space-x-1 pt-1">
                    <Info className="w-3.5 h-3.5 text-orange-500/70 flex-shrink-0 mt-0.5" />
                    <span>Free shipping threshold is $500. Add {formatMoney(500 - cartSubtotal)} more to save on shipping.</span>
                  </p>
                )}
              </div>

              {/* Final total amount */}
              <div className="border-t border-gray-900 pt-4 flex justify-between items-center font-mono">
                <span className="text-base font-bold text-white uppercase tracking-wider">Net Total</span>
                <span className="text-2xl font-extrabold text-orange-400">{formatMoney(finalTotal)}</span>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => navigate("/checkout", { state: { discountRate } })}
                className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-mono text-sm py-4 rounded-2xl font-bold uppercase transition-all duration-150 flex items-center justify-center space-x-2.5 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 border border-orange-400/20 cursor-pointer"
              >
                <span>Compile Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Promo Code Box */}
            <div className="bg-gray-950/40 border border-gray-900 rounded-3xl p-6 space-y-3">
              <label className="text-xs font-mono uppercase text-gray-500 tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-orange-400" />
                <span>Clearance Voucher</span>
              </label>
              
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter TECH10"
                  className="flex-grow bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-2.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none uppercase font-mono transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-850 active:bg-gray-800 text-gray-300 font-mono text-xs px-4 py-2.5 border border-gray-800 hover:border-gray-750 rounded-2xl font-bold transition-all duration-150 cursor-pointer"
                >
                  APPLY
                </button>
              </form>

              {promoError && (
                <p className="text-xs text-red-400 font-mono pl-1">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="text-xs text-emerald-400 font-mono pl-1">{promoSuccess}</p>
              )}
            </div>

          </div>

        </div>
      )}
      
    </div>
  );
};

export default Cart;