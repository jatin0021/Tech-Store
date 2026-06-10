import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { CheckCircle2, ShieldCheck, ArrowRight, Printer, AlertTriangle } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Retrieve state data sent from Checkout page
  const orderDetails = location.state;

  // Clear cart exactly once on component render
  useEffect(() => {
    if (orderDetails) {
      clearCart();
    }
  }, [orderDetails]); // Run only when details are loaded

  // Redirect to homepage if no order details exist (manual navigation protection)
  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <div className="flex justify-center text-orange-400">
          <AlertTriangle className="w-16 h-16" />
        </div>
        <p className="text-gray-400 font-mono text-base uppercase">
          Invalid Navigation Token: No active order payload detected.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/35 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer"
        >
          Return to Terminal Homepage
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
      <div className="max-w-xl w-full bg-gray-950/40 border border-gray-900 rounded-3xl p-8 md:p-10 text-center space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-1/4 left-1/3 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Success checkmark */}
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/30 text-emerald-400 animate-pulse">
            <CheckCircle2 className="w-16 h-16" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-widest">
            Authorization Successful
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white leading-none">
            ORDER SYNCHRONIZED
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Thank you for your purchase. Your payment charge has been validated and transaction ledger logged.
          </p>
        </div>

        {/* Invoice Grid Details */}
        <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 text-left font-mono text-xs space-y-3.5">
          <div className="flex justify-between border-b border-gray-900 pb-2.5">
            <span className="text-gray-500">Order ID:</span>
            <span className="text-orange-400 font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Receiver Name:</span>
            <span className="text-white font-bold">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Dispatch Target:</span>
            <span className="text-white font-bold truncate max-w-[200px]">{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Hardware Nodes:</span>
            <span className="text-white font-bold">{itemsCount} unit(s)</span>
          </div>
          <div className="flex justify-between border-t border-gray-900 pt-2.5">
            <span className="text-gray-500 font-bold">Paid Sum:</span>
            <span className="text-sm text-orange-400 font-bold">{formattedTotal}</span>
          </div>
        </div>

        {/* ETA alerts */}
        <div className="bg-gray-900/40 border border-gray-850 rounded-2xl p-4 text-xs font-mono text-gray-500 leading-relaxed uppercase flex items-start space-x-3 text-left">
          <ShieldCheck className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-gray-400">Dispatch ETA: 3-5 Standard Matrix Cycles</p>
            <p>A tracking key will be transmitted to your terminal email address once the hardware bundle leaves our distribution sector.</p>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-grow bg-gray-900 hover:bg-gray-850 active:bg-gray-800 text-gray-300 font-mono text-xs py-3.5 px-4 border border-gray-800 hover:border-gray-750 rounded-2xl font-bold transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT</span>
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex-grow bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-mono text-xs py-3.5 px-4 rounded-2xl font-bold uppercase transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 border border-orange-400/20"
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