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
        console.error("Failed to load orders list:", err);
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Order History
        </h1>
        <Link to="/collections" className="text-xs text-gray-400 hover:text-blue-600 font-sans tracking-wide font-semibold transition-colors uppercase flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse Store</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        /* Empty Ledger State */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="p-6 bg-blue-50 rounded-full border border-blue-100 text-blue-600">
            <Package className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider">No Orders Found</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Your order database logs are currently empty. Complete checkout flow on any items to register a purchase history.
            </p>
          </div>
          <Link
            to="/collections"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-sans text-sm px-6 py-3 rounded-lg font-bold uppercase transition-all duration-150 cursor-pointer shadow-sm border-none block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4 max-w-4xl mx-auto">
          {orders.map((order) => {
            const orderNum = `TS-${order._id?.substring(18).toUpperCase()}`;
            const isExpanded = expandedOrderId === order._id;
            const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 hover:border-blue-500/20 rounded-xl overflow-hidden transition-all duration-150 shadow-sm"
              >
                {/* Accordion Trigger Header */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm font-bold text-blue-600 uppercase font-sans">
                        {orderNum}
                      </span>
                      <span
                        className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded uppercase border ${
                          order.status === "Cancelled"
                            ? "bg-red-50 border-red-100 text-red-655"
                            : order.status === "Delivered"
                            ? "bg-green-50 border-green-100 text-green-655"
                            : "bg-blue-50 border-blue-100 text-blue-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-gray-450" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-6 md:border-l md:border-gray-200 md:pl-6">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-gray-400 uppercase block font-semibold">Total Amount</span>
                      <span className="text-base font-bold text-gray-900">{formatMoney(order.totalAmount)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-450">
                      <span className="text-xs font-semibold">{itemCount} Node(s)</span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Accordion Expandable Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50/50 p-6 space-y-6 animate-fadeIn">
                    
                    {/* Item list */}
                    <div className="space-y-4 text-left font-sans">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Products Purchased
                      </h4>
                      <div className="space-y-3">
                        {order.items?.map((item) => {
                          const title = item.product?.title || "Purged Hardware Product";
                          const image = item.product?.images?.[0] || "/favicon.svg";
                          return (
                            <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                  <img src={image} alt={title} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-sm text-gray-800 font-semibold block truncate max-w-[200px] sm:max-w-xs">
                                    {title}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    Qty {item.quantity} x {formatMoney(item.price)}
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-gray-900">
                                {formatMoney(item.price * item.quantity)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dispatch metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 text-xs text-gray-500 text-left font-sans">
                      <div className="space-y-1">
                        <span className="text-gray-400 block uppercase font-bold text-[10px]">Shipping Address</span>
                        <span className="text-gray-800 font-semibold">{order.shippingAddress?.name}</span>
                        <p className="text-gray-600 mt-0.5">{order.shippingAddress?.address}</p>
                        <p className="text-gray-600">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        </p>
                        <p className="text-gray-400 mt-1">Phone: {order.shippingAddress?.phone}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-gray-400 block uppercase font-bold text-[10px]">Status Information</span>
                        <div className="flex items-center space-x-1.5 font-bold text-blue-600">
                          {order.status === "Cancelled" ? (
                            <AlertCircle className="w-4 h-4 text-red-500 font-semibold" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                          )}
                          <span>
                            {order.status === "Pending" && "Awaiting Courier Scan"}
                            {order.status === "Processing" && "Processing in fulfillment warehouse"}
                            {order.status === "Shipped" && "In transit"}
                            {order.status === "Delivered" && "Signed and completed"}
                            {order.status === "Cancelled" && "Cancelled"}
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
