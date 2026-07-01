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
      <div className="container mx-auto px-4 py-20 text-center space-y-6 text-stone-800 animate-fadeIn">
        <div className="flex justify-center text-orange-600">
          <AlertTriangle className="w-16 h-16 animate-bounce" />
        </div>
        <p className="text-stone-500 font-mono text-base uppercase">
          Invalid Navigation Token: No active order payload detected.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-orange-50 hover:bg-orange-100/80 text-orange-600 border border-orange-105 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm"
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
      <div className="max-w-xl w-full bg-white border border-stone-100 rounded-3xl p-8 md:p-10 text-center space-y-8 shadow-xl relative overflow-hidden text-stone-850 animate-scaleUp">
        
        {/* Glow backdrop */}
        <div className="absolute -top-1/4 left-1/3 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Success checkmark */}
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 shadow-sm animate-pulse">
            <CheckCircle2 className="w-16 h-16" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs text-emerald-600 font-mono font-bold uppercase tracking-widest">
            Authorization Successful
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-stone-900 leading-none">
            ORDER SYNCHRONIZED
          </h1>
          <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed font-sans">
            Thank you for your purchase. Your payment charge has been validated and transaction ledger logged.
          </p>
        </div>

        {/* Invoice Grid Details */}
        <div className="bg-stone-50 border border-stone-150 rounded-2xl p-5 text-left font-mono text-xs space-y-3.5 text-stone-700 shadow-inner">
          <div className="flex justify-between border-b border-stone-200 pb-2.5">
            <span className="text-stone-400">Order ID:</span>
            <span className="text-orange-600 font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Receiver Name:</span>
            <span className="text-stone-805 font-bold">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Dispatch Target:</span>
            <span className="text-stone-800 truncate max-w-[200px]">{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Hardware Nodes:</span>
            <span className="text-stone-800 font-bold">{itemsCount} unit(s)</span>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-2.5">
            <span className="text-stone-400 font-bold">Paid Sum:</span>
            <span className="text-sm text-orange-600 font-bold">{formattedTotal}</span>
          </div>
        </div>

        {/* ETA alerts */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-xs font-mono text-stone-500 leading-relaxed uppercase flex items-start space-x-3 text-left">
          <ShieldCheck className="w-5 h-5 text-orange-655 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-stone-700">Dispatch ETA: 3-5 Standard Matrix Cycles</p>
            <p>A tracking key will be transmitted to your terminal email address once the hardware bundle leaves our distribution sector.</p>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-grow bg-white hover:bg-stone-50 text-stone-700 font-mono text-xs py-3.5 px-4 border border-stone-200 rounded-2xl font-bold transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT</span>
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex-grow bg-orange-600 hover:bg-orange-700 active:bg-orange-850 text-white font-mono text-xs py-3.5 px-4 rounded-2xl font-bold uppercase transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:shadow border border-orange-500/20"
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