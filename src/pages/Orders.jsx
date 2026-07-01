import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, Calendar, ShieldCheck, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import apiClient from "../api/api.js";
import Loading from "../components/Loading.jsx";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from database
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    apiClient
      .get("/orders")
      .then((res) => {
        if (active) {
          setOrders(res.data || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load order ledger:", err);
        if (active) {
          toast.error(err.message || "Failed to load purchase records.");
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format Date
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Toggle order accordion details
  const toggleExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  if (isLoading) {
    return <Loading type="details" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-stone-850">
      {/* Header */}
      <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">
          Transaction <span className="text-orange-600">Ledger</span>
        </h1>
        <Link to="/" className="text-xs text-stone-400 hover:text-orange-655 font-mono transition-colors uppercase flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse Store</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        /* Empty Ledger State */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-stone-200 rounded-3xl bg-white shadow-sm">
          <div className="p-6 bg-orange-50 rounded-full border border-orange-100 text-orange-600">
            <Package className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-stone-850 uppercase tracking-wider">No Transaction History</h2>
            <p className="text-sm text-stone-500 max-w-sm">
              Your order database logs are currently empty. Complete checkout flow on any items to register a ledger.
            </p>
          </div>
          <Link
            to="/"
            className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-mono text-sm px-6 py-3.5 rounded-2xl font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4 max-w-4xl mx-auto">
          {orders.map((order) => {
            const orderNum = `TS-${order._id?.substring(18).toUpperCase()}-Matrix`;
            const isExpanded = expandedOrderId === order._id;
            const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

            return (
              <div
                key={order._id}
                className="bg-white border border-stone-100 hover:border-orange-500/20 rounded-3xl overflow-hidden transition-all duration-200 shadow-sm"
              >
                {/* Accordion Trigger Header */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm font-bold text-orange-600 font-mono uppercase">
                        {orderNum}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                          order.status === "Cancelled"
                            ? "bg-red-50 border-red-100 text-red-600"
                            : order.status === "Delivered"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : "bg-orange-50 border-orange-100 text-orange-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-stone-400 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-6 md:border-l md:border-stone-100 md:pl-6">
                    <div className="text-left md:text-right font-mono">
                      <span className="text-[10px] text-stone-400 uppercase block">Total Sum</span>
                      <span className="text-base font-extrabold text-stone-800">{formatMoney(order.totalAmount)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-stone-400">
                      <span className="text-xs font-mono">{itemCount} Node(s)</span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Accordion Expandable Details */}
                {isExpanded && (
                  <div className="border-t border-stone-100 bg-stone-50/50 p-6 space-y-6 animate-fadeIn">
                    
                    {/* Item list */}
                    <div className="space-y-4 text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-450">
                        Hardware Nodes Transmitted
                      </h4>
                      <div className="space-y-3">
                        {order.items?.map((item) => {
                          const title = item.product?.title || "Purged Hardware Node";
                          const image = item.product?.images?.[0] || "/favicon.svg";
                          return (
                            <div key={item._id} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-b-0">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-stone-150">
                                  <img src={image} alt={title} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-sm text-stone-850 font-bold block truncate max-w-[200px] sm:max-w-xs">
                                    {title}
                                  </span>
                                  <span className="text-xs text-stone-400 font-mono">
                                    Qty {item.quantity} x {formatMoney(item.price)}
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm font-mono font-bold text-stone-800">
                                {formatMoney(item.price * item.quantity)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dispatch metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 text-xs font-mono text-stone-500 text-left">
                      <div className="space-y-1">
                        <span className="text-stone-400 block uppercase">Shipping Protocol Address</span>
                        <span className="text-stone-800 font-bold">{order.shippingAddress?.name}</span>
                        <p className="text-stone-600 mt-0.5">{order.shippingAddress?.address}</p>
                        <p className="text-stone-650">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        </p>
                        <p className="text-stone-400 mt-1">Tel: {order.shippingAddress?.phone}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-stone-400 block uppercase">Network Dispatch Status</span>
                        <div className="flex items-center space-x-1.5 font-bold text-orange-655">
                          {order.status === "Cancelled" ? (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-orange-600" />
                          )}
                          <span>
                            {order.status === "Pending" && "Awaiting Courier Sector Scan"}
                            {order.status === "Processing" && "Processing inside hardware array"}
                            {order.status === "Shipped" && "Out for transit delivery"}
                            {order.status === "Delivered" && "Signed and completed"}
                            {order.status === "Cancelled" && "Purged/Cancelled"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
