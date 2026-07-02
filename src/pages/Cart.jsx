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
      setPromoSuccess("Coupon Applied: 10% discount credited!");
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-gray-800">
      
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Shopping Cart
        </h1>
        <Link to="/collections" className="text-xs text-gray-400 hover:text-blue-600 font-sans tracking-wide font-semibold transition-colors uppercase flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Keep Browsing</span>
        </Link>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="p-6 bg-blue-50 rounded-full border border-blue-100 text-blue-600">
            <ShoppingCart className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider font-sans">Your Cart is Empty</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Your active checkout buffer is currently empty. Explore the catalog to add items.
            </p>
          </div>
          <Link
            to="/collections"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-sans text-xs px-6 py-3.5 rounded-lg font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm border-none block"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        /* Cart Active List */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem key={item.product._id || item.product.id} item={item} />
              ))}
            </div>
            
            {/* Clear Cart Button */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to purge the cart?")) {
                  clearCart();
                  toast.success("Cart cleared successfully.");
                }
              }}
              className="inline-flex items-center space-x-2 text-xs text-gray-400 hover:text-red-650 transition-colors font-sans font-semibold uppercase cursor-pointer border-none bg-transparent"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>

          {/* Right Side: Price Details Card */}
          <div className="space-y-6">
            
            {/* Summary Box */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6 shadow-sm text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-150 pb-3">
                Order Summary
              </h3>

              {/* Price Rows */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-semibold">{formatMoney(cartSubtotal)}</span>
                </div>
                
                {discountCost > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount (10%)</span>
                    <span>-{formatMoney(discountCost)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    <span className="text-gray-900 font-semibold">{formatMoney(shippingCost)}</span>
                  )}
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Tax (8%)</span>
                  <span className="text-gray-900 font-semibold">{formatMoney(taxCost)}</span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-[11px] text-gray-400 flex items-start space-x-1.5 pt-1 font-sans leading-relaxed">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Free shipping threshold is $500. Add {formatMoney(500 - cartSubtotal)} more to save on shipping.</span>
                  </p>
                )}
              </div>

              {/* Final total amount */}
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Total</span>
                <span className="text-2xl font-bold text-blue-600">{formatMoney(finalTotal)}</span>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => navigate("/checkout", { state: { discountRate } })}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-sans text-xs py-3.5 rounded-lg font-bold uppercase transition-all duration-150 flex items-center justify-center space-x-2 shadow-sm cursor-pointer border-none"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Promo Code Box */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm text-left">
              <label className="text-xs font-semibold uppercase text-gray-700 tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Promo Code</span>
              </label>
              
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter TECH10"
                  className="flex-grow bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-lg py-2 px-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none uppercase transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-gray-50 text-gray-700 font-sans text-xs px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg font-semibold transition-all duration-150 cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <p className="text-xs text-red-600 pl-1 font-semibold">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="text-xs text-green-600 pl-1 font-semibold">{promoSuccess}</p>
              )}
            </div>

          </div>

        </div>
      )}
      
    </div>
  );
};

export default Cart;