import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import apiClient from "../api/api.js";
import { ShieldCheck, ArrowLeft, ShoppingBag, Terminal } from "lucide-react";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve discount rate from state
  const discountRate = location.state?.discountRate || 0;

  // Form State
  const [shippingData, setShippingData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Input changes handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validation helper
  const validateForm = () => {
    const newErrors = {};
    if (!shippingData.name.trim()) newErrors.name = "Full name is required.";
    if (!shippingData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(shippingData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit number.";
    }
    if (!shippingData.address.trim()) newErrors.address = "Street address is required.";
    if (!shippingData.city.trim()) newErrors.city = "City is required.";
    if (!shippingData.state.trim()) newErrors.state = "State is required.";
    if (!shippingData.pincode.trim()) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{5,6}$/.test(shippingData.pincode.trim())) {
      newErrors.pincode = "Enter a valid pincode.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Place Order Submit
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const checkoutToast = toast.loading("Synching transaction authorization...");
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          product: item.product._id || item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: shippingData,
        totalAmount: finalTotal,
      };

      const res = await apiClient.post("/orders", orderPayload);
      toast.success("Order synchronized successfully!", { id: checkoutToast });
      
      // Clear Cart state
      clearCart();

      // Navigate to order confirmation
      navigate("/order-confirmation", { state: { order: res.data } });
    } catch (err) {
      toast.error(err.message || "Failed to finalize checkout.", {
        id: checkoutToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const shippingCost = cartSubtotal >= 500 ? 0 : cartSubtotal > 0 ? 15.00 : 0;
  const taxCost = cartSubtotal * 0.08;
  const discountCost = cartSubtotal * discountRate;
  const finalTotal = cartSubtotal + shippingCost + taxCost - discountCost;

  // Format currency helper
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-red-500 font-sans text-sm uppercase font-semibold">Access Denied: Empty Cart Buffer.</p>
        <Link to="/collections" className="inline-flex items-center space-x-2 text-gray-500 hover:text-blue-600 font-sans text-xs uppercase font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-gray-800">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Shipping Address Form */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm text-left">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-950 border-b border-gray-150 pb-3 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>Shipping Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Receiver Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Receiver Name</label>
                <input
                  type="text"
                  name="name"
                  value={shippingData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
                {errors.name && <p className="text-xs text-red-600 mt-0.5 font-semibold">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Contact Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={shippingData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
                {errors.phone && <p className="text-xs text-red-600 mt-0.5 font-semibold">{errors.phone}</p>}
              </div>

              {/* Street Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingData.address}
                  onChange={handleInputChange}
                  placeholder="128 Cyber Avenue, Suite B"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
                {errors.address && <p className="text-xs text-red-600 mt-0.5 font-semibold">{errors.address}</p>}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingData.city}
                  onChange={handleInputChange}
                  placeholder="Neo City"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
                {errors.city && <p className="text-xs text-red-600 mt-0.5 font-semibold">{errors.city}</p>}
              </div>

              {/* State & Pincode Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    placeholder="CA"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                  />
                  {errors.state && <p className="text-xs text-red-600 mt-0.5 font-semibold">{errors.state}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingData.pincode}
                    onChange={handleInputChange}
                    placeholder="94016"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                  />
                  {errors.pincode && <p className="text-xs text-red-600 mt-0.5 font-semibold">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Encryption Trust Notice */}
            <div className="bg-blue-50/50 border border-blue-100/50 rounded-lg p-4 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 font-sans text-xs leading-relaxed text-gray-500">
                <p className="font-bold text-gray-700">Order Verification Secured</p>
                <p>No payment card is required for processing. Review your items on the right side panel and confirm your order.</p>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="pt-4 border-t border-gray-150 flex justify-between items-center text-xs">
              <Link
                to="/cart"
                className="inline-flex items-center space-x-2 text-gray-400 hover:text-blue-600 transition-colors font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Cart</span>
              </Link>
              
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-sans text-xs px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-150 flex items-center space-x-2 cursor-pointer border-none shadow-sm"
              >
                <span>Confirm Purchase</span>
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <aside className="space-y-6 text-left">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-150 pb-3">
              Order Items
            </h3>

            {/* Product items lists */}
            <div className="max-h-[220px] overflow-y-auto space-y-3 pr-2 no-scrollbar">
              {cart.map((item) => {
                const name = item.product.title || item.product.name;
                const price = item.product.price - (item.product.discountPrice || 0);
                return (
                  <div key={item.product._id || item.product.id} className="flex justify-between items-center text-sm">
                    <div className="min-w-0 pr-4">
                      <span className="text-gray-900 block font-semibold truncate">{name}</span>
                      <span className="text-gray-400 text-xs font-medium">Qty {item.quantity} x {formatMoney(price)}</span>
                    </div>
                    <span className="text-gray-900 font-bold">{formatMoney(price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations lines */}
            <div className="border-t border-gray-150 pt-4 space-y-2.5 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 font-semibold">{formatMoney(cartSubtotal)}</span>
              </div>
              {discountCost > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatMoney(discountCost)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-900 font-semibold">{shippingCost === 0 ? "FREE" : formatMoney(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-gray-900 font-semibold">{formatMoney(taxCost)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="border-t border-gray-150 pt-4 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Total</span>
              <span className="text-xl font-bold text-blue-600">{formatMoney(finalTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;