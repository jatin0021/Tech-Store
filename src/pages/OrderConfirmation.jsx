import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { CheckCircle2, ShieldCheck, ArrowRight, Printer, AlertTriangle } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Retrieve state data sent from Checkout page
  const orderDetails = location.state?.order;

  // Clear cart exactly once on component render
  useEffect(() => {
    if (orderDetails) {
      clearCart();
    }
  }, [orderDetails]); // Run only when details are loaded

  // Redirect if no order details exist (manual navigation protection)
  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6 text-gray-800 animate-fadeIn">
        <div className="flex justify-center text-red-500">
          <AlertTriangle className="w-16 h-16 animate-bounce" />
        </div>
        <p className="text-gray-500 text-base font-semibold uppercase">
          Invalid Navigation Token: No active order detected.
        </p>
        <Link
          to="/collections"
          className="inline-flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-6 py-3 rounded-lg text-xs font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const { orderNumber, customerName, email, total, itemsCount } = orderDetails;

  // Format currency
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-xl p-8 md:p-10 text-center space-y-8 shadow-md relative overflow-hidden text-gray-800 animate-scaleUp">
        
        {/* Glow backdrop */}
        <div className="absolute -top-1/4 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Success checkmark */}
        <div className="flex justify-center">
          <div className="p-4 bg-green-50 border border-green-100 rounded-full text-green-600 shadow-sm animate-pulse">
            <CheckCircle2 className="w-16 h-16" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs text-green-600 font-semibold uppercase tracking-widest">
            Order Complete
          </span>
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-gray-900 leading-none">
            ORDER CONFIRMED
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Thank you for your purchase. Your order has been synchronized and the confirmation receipt details logged.
          </p>
        </div>

        {/* Invoice Grid Details */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-left text-sm space-y-3.5 text-gray-700">
          <div className="flex justify-between border-b border-gray-200 pb-2.5">
            <span className="text-gray-400">Order ID:</span>
            <span className="text-blue-600 font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Receiver Name:</span>
            <span className="text-gray-800 font-semibold">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dispatch Target:</span>
            <span className="text-gray-800 truncate max-w-[200px] font-medium">{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Items:</span>
            <span className="text-gray-800 font-semibold">{itemsCount} unit(s)</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2.5">
            <span className="text-gray-450 font-bold">Total Paid:</span>
            <span className="text-base text-blue-600 font-bold">{formattedTotal}</span>
          </div>
        </div>

        {/* ETA alerts */}
        <div className="bg-blue-50/40 border border-blue-100/40 rounded-lg p-4 text-xs text-gray-500 leading-relaxed flex items-start space-x-3 text-left">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-gray-700">Dispatch ETA: 3-5 Standard Days</p>
            <p>A tracking link will be sent to your email address once the order leaves our distribution center.</p>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-grow bg-white hover:bg-gray-50 text-gray-700 text-xs py-3 px-4 border border-gray-200 rounded-lg font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT</span>
          </button>
          
          <button
            onClick={() => navigate("/collections")}
            className="flex-grow bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs py-3 px-4 rounded-lg font-bold uppercase transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer border-none shadow-sm"
          >
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;