import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Terminal, HelpCircle } from "lucide-react";

const Checkout = () => {
  const { cart, cartSubtotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve carrying discount rate from Cart page
  const discountRate = location.state?.discountRate || 0;

  // Checkout Step
  const [step, setStep] = useState(1); // 1 = Shipping, 2 = Payment

  // Shipping Form State
  const [shippingData, setShippingData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
  });

  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Form Validation Errors State
  const [errors, setErrors] = useState({});

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

  // Form Handlers
  const handleShippingChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
    // Clear error
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
    // Clear error
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Validate Shipping step
  const validateShipping = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!shippingData.email || !emailRegex.test(shippingData.email)) {
      tempErrors.email = "Please specify a valid communications email.";
    }
    if (!shippingData.name.trim()) {
      tempErrors.name = "Full name signature required.";
    }
    if (!shippingData.address.trim()) {
      tempErrors.address = "Terminal dispatch address required.";
    }
    if (!shippingData.city.trim()) {
      tempErrors.city = "Dispatch city required.";
    }
    if (!shippingData.zipCode.trim() || shippingData.zipCode.length < 5) {
      tempErrors.zipCode = "Zip/postal code signature invalid.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Validate Payment step
  const validatePayment = () => {
    const tempErrors = {};

    if (!paymentData.cardName.trim()) {
      tempErrors.cardName = "Cardholder signature required.";
    }
    if (!paymentData.cardNumber.replace(/\s/g, "") || paymentData.cardNumber.replace(/\s/g, "").length < 16) {
      tempErrors.cardNumber = "A 16-digit card signature is required.";
    }
    if (!paymentData.expiry || !paymentData.expiry.includes("/")) {
      tempErrors.expiry = "Expiry signature (MM/YY) required.";
    }
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      tempErrors.cvv = "Security CVV code (3 digits) required.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      // Generate Order Number
      const randNum = Math.floor(100000 + Math.random() * 900000);
      const orderNumber = `TS-${randNum}-Matrix`;

      // Save order to localStorage history logs
      try {
        const newOrder = {
          orderNumber,
          date: new Date().toISOString(),
          customerName: shippingData.name,
          email: shippingData.email,
          total: finalTotal,
          itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
          items: cart.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
            category: item.product.category,
          })),
        };
        const existingOrders = JSON.parse(localStorage.getItem("tech_store_orders") || "[]");
        localStorage.setItem("tech_store_orders", JSON.stringify([newOrder, ...existingOrders]));
      } catch (err) {
        console.error("Failed to save order transaction log:", err);
      }

      // Redirect to Order Confirmation passing details
      navigate("/order-confirmation", {
        state: {
          orderNumber,
          customerName: shippingData.name,
          email: shippingData.email,
          total: finalTotal,
          itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
        },
      });
    }
  };

  // Prevent accessing checkout with an empty cart
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-orange-400 font-mono text-sm uppercase">Access Denied: Empty Cart Buffer.</p>
        <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-orange-400 font-mono text-xs uppercase">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header & Stepper */}
      <div className="border-b border-gray-900/60 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider">
            Checkout <span className="text-orange-400">Terminal</span>
          </h1>
        </div>

        {/* Stepper Steps UI */}
        <div className="flex items-center space-x-4 font-mono text-xs">
          <span className={`px-3 py-1.5 rounded-xl border ${step === 1 ? "bg-orange-500/15 border-orange-500 text-orange-400 font-bold" : "bg-gray-900/50 border-gray-800 text-gray-500"}`}>
            1. Dispatch Node
          </span>
          <span className="text-gray-850">==&gt;</span>
          <span className={`px-3 py-1.5 rounded-xl border ${step === 2 ? "bg-orange-500/15 border-orange-500 text-orange-400 font-bold" : "bg-gray-900/50 border-gray-800 text-gray-500"}`}>
            2. Payment Gate
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Form Deck */}
        <div className="lg:col-span-2 bg-gray-950/40 border border-gray-900 rounded-3xl p-6 md:p-8">
          
          {step === 1 ? (
            /* STEP 1: Shipping Address details */
            <form onSubmit={handleNextStep} className="space-y-6">
              <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-white border-b border-gray-900 pb-3 flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-orange-400" />
                <span>Dispatch Details</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Contact Email */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">Contact Email</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleShippingChange}
                    placeholder="architect@matrix.com"
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors"
                  />
                  {errors.email && <p className="text-xs text-red-400 font-mono">{errors.email}</p>}
                </div>

                {/* Full Name */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">Receiver Signature (Full Name)</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingData.name}
                    onChange={handleShippingChange}
                    placeholder="John Doe"
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors"
                  />
                  {errors.name && <p className="text-xs text-red-400 font-mono">{errors.name}</p>}
                </div>

                {/* Delivery Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">Node Address (Street / Suite)</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    placeholder="128 Cyber Avenue, Suite B"
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors"
                  />
                  {errors.address && <p className="text-xs text-red-400 font-mono">{errors.address}</p>}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">City Sector</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingData.city}
                    onChange={handleShippingChange}
                    placeholder="Neo City"
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors"
                  />
                  {errors.city && <p className="text-xs text-red-400 font-mono">{errors.city}</p>}
                </div>

                {/* Zip Code */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingData.zipCode}
                    onChange={handleShippingChange}
                    placeholder="94016"
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors"
                  />
                  {errors.zipCode && <p className="text-xs text-red-400 font-mono">{errors.zipCode}</p>}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="pt-4 border-t border-gray-900/50 flex justify-between">
                <Link
                  to="/cart"
                  className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-gray-500 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Cart</span>
                </Link>
                
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-mono text-xs px-6 py-3.5 rounded-2xl font-bold uppercase transition-all duration-150 flex items-center space-x-2 cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  <span>Verify and Proceed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          ) : (
            /* STEP 2: Credit Card info */
            <form onSubmit={handleCompleteOrder} className="space-y-6">
              <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-white border-b border-gray-900 pb-3 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-orange-400" />
                <span>Secure Payment Gate</span>
              </h2>

              <div className="space-y-5">
                {/* Cardholder Name */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">Cardholder Signature Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentChange}
                    placeholder="JOHN DOE"
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors font-mono uppercase"
                  />
                  {errors.cardName && <p className="text-xs text-red-400 font-mono">{errors.cardName}</p>}
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">Card Number (16 Digits)</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="4111 2222 3333 4444"
                    maxLength="19"
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors font-mono"
                  />
                  {errors.cardNumber && <p className="text-xs text-red-400 font-mono">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      name="expiry"
                      value={paymentData.expiry}
                      onChange={handlePaymentChange}
                      placeholder="12/28"
                      maxLength="5"
                      className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors font-mono"
                    />
                    {errors.expiry && <p className="text-xs text-red-400 font-mono">{errors.expiry}</p>}
                  </div>

                  {/* CVV */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">CVV Code</label>
                    <input
                      type="password"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      placeholder="***"
                      maxLength="4"
                      className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors font-mono"
                    />
                    {errors.cvv && <p className="text-xs text-red-400 font-mono">{errors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* Encryption Trust Notice */}
              <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 font-mono text-[10px] leading-relaxed text-gray-500 uppercase">
                  <p className="font-bold text-gray-400">Secure Matrix SSL Encryption Enabled</p>
                  <p>All credit information is parsed using virtual tokens. We never store raw cardholder keys.</p>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="pt-4 border-t border-gray-900/50 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dispatch</span>
                </button>
                
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-mono text-xs px-6 py-3.5 rounded-2xl font-bold uppercase transition-all duration-150 flex items-center space-x-2 cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  <span>Authorize Charge</span>
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Right Side: Order Summary Checklist */}
        <aside className="space-y-6">
          <div className="bg-gray-950/40 border border-gray-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white border-b border-gray-900 pb-3">
              Order Node Summary
            </h3>

            {/* Product items lists */}
            <div className="max-h-[220px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-xs font-mono">
                  <div className="min-w-0 pr-4">
                    <span className="text-white block font-bold truncate">{item.product.name}</span>
                    <span className="text-gray-500">Qty {item.quantity} x {formatMoney(item.product.price)}</span>
                  </div>
                  <span className="text-white font-bold">{formatMoney(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Calculations lines */}
            <div className="border-t border-gray-900 pt-4 space-y-2.5 font-mono text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(cartSubtotal)}</span>
              </div>
              {discountCost > 0 && (
                <div className="flex justify-between text-emerald-400">
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
            <div className="border-t border-gray-900 pt-4 flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Final Total</span>
              <span className="text-xl font-extrabold text-orange-400">{formatMoney(finalTotal)}</span>
            </div>
          </div>
        </aside>

      </div>
      
    </div>
  );
};

export default Checkout;