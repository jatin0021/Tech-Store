import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../api/api.js";
import toast from "react-hot-toast";
import { ArrowLeft, ShieldCheck, Terminal, ShoppingBag } from "lucide-react";

const Checkout = () => {
  const { cart, cartSubtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve carrying discount rate from Cart page
  const discountRate = location.state?.discountRate || 0;

  // Shipping Form State
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

  // Prepopulate form fields if user records are available
  useEffect(() => {
    if (user) {
      setShippingData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      });
    }
  }, [user]);

  // Calculations
  const shippingCost = cartSubtotal >= 500 ? 0 : cartSubtotal > 0 ? 15.00 : 0;
  const taxCost = cartSubtotal * 0.08;
  const discountCost = cartSubtotal * discountRate;
  const finalTotal = cartSubtotal + shippingCost + taxCost - discountCost;

  // Format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleInputChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
    // Clear error
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const tempErrors = {};
    if (!shippingData.name.trim()) tempErrors.name = "Full name signature required.";
    if (!shippingData.phone.trim() || shippingData.phone.length < 10) {
      tempErrors.phone = "Provide a valid 10-digit phone number.";
    }
    if (!shippingData.address.trim()) tempErrors.address = "Delivery address is required.";
    if (!shippingData.city.trim()) tempErrors.city = "City name required.";
    if (!shippingData.state.trim()) tempErrors.state = "State code required.";
    if (!shippingData.pincode.trim() || shippingData.pincode.length < 5) {
      tempErrors.pincode = "Invalid pincode signature.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const orderToast = toast.loading("Processing order authorization blocks...");

    try {
      const orderItems = cart.map((item) => ({
        product: item.product._id || item.product.id,
        quantity: item.quantity,
        price: item.product.price - (item.product.discountPrice || 0),
      }));

      const payload = {
        items: orderItems,
        shippingAddress: {
          name: shippingData.name,
          phone: shippingData.phone,
          address: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.pincode,
        },
        totalAmount: finalTotal,
      };

      const res = await apiClient.post("/orders", payload);
      
      toast.success("Order authorized and logged in system registry!", { id: orderToast });

      // Redirect to Order Confirmation page
      navigate("/order-confirmation", {
        state: {
          orderNumber: `TS-${res.data._id?.substring(18).toUpperCase()}-Matrix`,
          customerName: shippingData.name,
          email: user?.email,
          total: finalTotal,
          itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
        },
      });
    } catch (err) {
      toast.error(err.message || "Checkout failed due to stock depletion or system error.", {
        id: orderToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-orange-600 font-mono text-sm uppercase">Access Denied: Empty Cart Buffer.</p>
        <Link to="/" className="inline-flex items-center space-x-2 text-stone-850 hover:text-orange-655 font-mono text-xs uppercase">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-stone-800">
      {/* Page Header */}
      <div className="border-b border-stone-105 pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">
          Checkout <span className="text-orange-600">Terminal</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Shipping Address Form */}
        <div className="lg:col-span-2 bg-white border border-stone-100 rounded-[28px] p-6 md:p-8 shadow-sm text-left">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <h2 className="text-base font-bold font-sans uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3 flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-orange-600" />
              <span>Dispatch Protocols</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Receiver Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Receiver Signature (Full Name)</label>
                <input
                  type="text"
                  name="name"
                  value={shippingData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full bg-stone-50 border border-stone-250 focus:bg-white focus:border-orange-500/30 rounded-2xl py-3 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
                />
                {errors.name && <p className="text-xs text-red-600 font-mono mt-0.5">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Contact Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={shippingData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full bg-stone-50 border border-stone-250 focus:bg-white focus:border-orange-500/30 rounded-2xl py-3 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
                />
                {errors.phone && <p className="text-xs text-red-600 font-mono mt-0.5">{errors.phone}</p>}
              </div>

              {/* Street Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Node Address (Street / Suite)</label>
                <input
                  type="text"
                  name="address"
                  value={shippingData.address}
                  onChange={handleInputChange}
                  placeholder="128 Cyber Avenue, Suite B"
                  className="w-full bg-stone-50 border border-stone-255 focus:bg-white focus:border-orange-500/30 rounded-2xl py-3 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
                />
                {errors.address && <p className="text-xs text-red-600 font-mono mt-0.5">{errors.address}</p>}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">City Sector</label>
                <input
                  type="text"
                  name="city"
                  value={shippingData.city}
                  onChange={handleInputChange}
                  placeholder="Neo City"
                  className="w-full bg-stone-50 border border-stone-250 focus:bg-white focus:border-orange-500/30 rounded-2xl py-3 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
                />
                {errors.city && <p className="text-xs text-red-600 font-mono mt-0.5">{errors.city}</p>}
              </div>

              {/* State & Pincode Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    placeholder="CA"
                    className="w-full bg-stone-50 border border-stone-250 focus:bg-white focus:border-orange-500/30 rounded-2xl py-3 px-2 text-xs text-stone-800 focus:outline-none transition-colors"
                  />
                  {errors.state && <p className="text-xs text-red-600 font-mono mt-0.5">{errors.state}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingData.pincode}
                    onChange={handleInputChange}
                    placeholder="94016"
                    className="w-full bg-stone-50 border border-stone-250 focus:bg-white focus:border-orange-500/30 rounded-2xl py-3 px-2 text-xs text-stone-800 focus:outline-none transition-colors"
                  />
                  {errors.pincode && <p className="text-xs text-red-600 font-mono mt-0.5">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Encryption Trust Notice */}
            <div className="bg-orange-50 border border-orange-100/50 rounded-2xl p-4 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-orange-605 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 font-sans text-[10px] leading-relaxed text-stone-500 uppercase font-semibold">
                <p className="font-bold text-stone-700">Order Verification Secured</p>
                <p>No payment card is required for processing. Review your items on the right side panel and confirm your order.</p>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="pt-4 border-t border-stone-100 flex justify-between items-center font-mono text-xs">
              <Link
                to="/cart"
                className="inline-flex items-center space-x-2 text-stone-400 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Cart</span>
              </Link>
              
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-600 hover:bg-orange-700 active:bg-orange-850 text-white font-sans text-xs px-6 py-3.5 rounded-2xl font-bold uppercase tracking-wider transition-all duration-150 flex items-center space-x-2 cursor-pointer shadow-sm hover:shadow"
              >
                <span>Confirm Purchase</span>
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <aside className="space-y-6 text-left">
          <div className="bg-white border border-stone-100 rounded-[28px] p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold font-sans uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3">
              Order Node Summary
            </h3>

            {/* Product items lists */}
            <div className="max-h-[220px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {cart.map((item) => {
                const name = item.product.title || item.product.name;
                const price = item.product.price - (item.product.discountPrice || 0);
                return (
                  <div key={item.product._id || item.product.id} className="flex justify-between items-center text-xs font-mono">
                    <div className="min-w-0 pr-4">
                      <span className="text-stone-800 block font-bold truncate">{name}</span>
                      <span className="text-stone-400 font-sans">Qty {item.quantity} x {formatMoney(price)}</span>
                    </div>
                    <span className="text-stone-800 font-bold">{formatMoney(price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations lines */}
            <div className="border-t border-stone-100 pt-4 space-y-2.5 font-mono text-xs text-stone-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(cartSubtotal)}</span>
              </div>
              {discountCost > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Matrix Promo</span>
                  <span>-{formatMoney(discountCost)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Dispatch cost</span>
                <span>{shippingCost === 0 ? "FREE" : formatMoney(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>{formatMoney(taxCost)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="border-t border-stone-100 pt-4 flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Final Total</span>
              <span className="text-xl font-extrabold text-orange-600">{formatMoney(finalTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;