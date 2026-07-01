import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import CartItem from "../components/CartItem.jsx";
import { ShoppingCart, ArrowRight, ArrowLeft, Tag, Info, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Promo Code State
  const [promoInput, setPromoInput] = useState("");
  const [discountRate, setDiscountRate] = useState(0); // e.g. 0.10 for 10%
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const code = promoInput.trim().toUpperCase();
    if (code === "TECH10") {
      setDiscountRate(0.10);
      setPromoSuccess("Coupon Applied: 10% matrix discount credited!");
      toast.success("Promo discount credited!");
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-stone-800">
      
      {/* Page Header */}
      <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-905">
          Shopping Cart <span className="text-orange-600">Deck</span>
        </h1>
        <Link to="/" className="text-xs text-stone-400 hover:text-orange-600 font-mono transition-colors uppercase flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Keep Browsing</span>
        </Link>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-stone-200 rounded-3xl bg-white shadow-sm">
          <div className="p-6 bg-orange-50 rounded-full border border-orange-100 text-orange-600">
            <ShoppingCart className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-stone-850 uppercase tracking-wider">Cart Matrix Empty</h2>
            <p className="text-sm text-stone-500 max-w-sm">
              Your active checkout buffer is currently empty. Query the hardware store to load items.
            </p>
          </div>
          <Link
            to="/"
            className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-mono text-xs px-6 py-3.5 rounded-2xl font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm"
          >
            Explore System Catalog
          </Link>
        </div>
      ) : (
        /* Cart Active List */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4 font-mono">
              {cart.map((item) => (
                <CartItem key={item.product._id || item.product.id} item={item} />
              ))}
            </div>
            
            {/* Clear Cart Button */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to purge the cart buffer?")) {
                  clearCart();
                  toast.success("Cart purged successfully.");
                }
              }}
              className="inline-flex items-center space-x-2 text-xs text-stone-400 hover:text-red-600 transition-colors font-mono uppercase cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Cart Buffer</span>
            </button>
          </div>

          {/* Right Side: Price Details Card */}
          <div className="space-y-6">
            
            {/* Summary Box */}
            <div className="bg-white border border-stone-100 rounded-3xl p-6 space-y-6 shadow-sm text-left">
              <h3 className="text-base font-bold font-sans uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3">
                Order Invoice
              </h3>

              {/* Price Rows */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="text-stone-800 font-bold">{formatMoney(cartSubtotal)}</span>
                </div>
                
                {discountCost > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Matrix Promo (10%)</span>
                    <span>-{formatMoney(discountCost)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-505">
                  <span>Priority Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 uppercase font-bold">FREE DISPATCH</span>
                  ) : (
                    <span className="text-stone-800 font-bold">{formatMoney(shippingCost)}</span>
                  )}
                </div>

                <div className="flex justify-between text-stone-500">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-stone-800 font-bold">{formatMoney(taxCost)}</span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-[10px] text-stone-400 flex items-start space-x-1 pt-1 font-sans leading-relaxed">
                    <Info className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Free shipping threshold is $500. Add {formatMoney(500 - cartSubtotal)} more to save on shipping.</span>
                  </p>
                )}
              </div>

              {/* Final total amount */}
              <div className="border-t border-stone-100 pt-4 flex justify-between items-center font-mono">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Net Total</span>
                <span className="text-2xl font-black text-orange-600">{formatMoney(finalTotal)}</span>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => navigate("/checkout", { state: { discountRate } })}
                className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-mono text-xs py-4 rounded-2xl font-bold uppercase transition-all duration-150 flex items-center justify-center space-x-2 shadow-sm hover:shadow cursor-pointer border border-orange-500/20"
              >
                <span>Compile Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Promo Code Box */}
            <div className="bg-white border border-stone-100 rounded-3xl p-6 space-y-3 shadow-sm text-left">
              <label className="text-xs font-semibold uppercase text-stone-505 tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-orange-600" />
                <span>Clearance Voucher</span>
              </label>
              
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter TECH10"
                  className="flex-grow bg-stone-50 border border-stone-200 focus:border-orange-500/30 rounded-2xl py-2.5 px-4 text-xs text-stone-850 placeholder-stone-400 focus:outline-none uppercase font-mono transition-colors"
                />
                <button
                  type="submit"
                  className="bg-stone-100 hover:bg-stone-200 active:bg-stone-250 text-stone-700 font-mono text-[10px] px-4 py-2.5 border border-stone-200 rounded-2xl font-bold transition-all duration-150 cursor-pointer"
                >
                  APPLY
                </button>
              </form>

              {promoError && (
                <p className="text-xs text-red-600 font-mono pl-1">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="text-xs text-emerald-600 font-mono pl-1">{promoSuccess}</p>
              )}
            </div>

          </div>

        </div>
      )}
      
    </div>
  );
};

export default Cart;