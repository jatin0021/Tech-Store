import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, Calendar, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Load orders from localStorage
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("tech_store_orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (err) {
      console.error("Failed to load order matrix logs:", err);
    }
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-900/60 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider">
          Transaction <span className="text-orange-400">Ledger</span>
        </h1>
        <Link to="/" className="text-xs text-gray-500 hover:text-orange-400 font-mono transition-colors uppercase flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse Store</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        /* Empty Ledger State */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-gray-900 rounded-3xl bg-gray-950/10">
          <div className="p-6 bg-orange-500/5 rounded-full border border-orange-500/20 text-orange-400">
            <Package className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">No Transaction History</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Your order database logs are currently empty. Complete checkout flow on any items to register a ledger.
            </p>
          </div>
          <Link
            to="/"
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-mono text-sm px-6 py-3.5 rounded-2xl font-bold uppercase transition-all duration-150 cursor-pointer shadow-lg shadow-orange-500/20"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4 max-w-4xl mx-auto">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.orderNumber;
            return (
              <div
                key={order.orderNumber}
                className="bg-gray-950/40 border border-gray-900 hover:border-orange-500/20 rounded-3xl overflow-hidden transition-all duration-200"
              >
                {/* Accordion Trigger Header */}
                <div
                  onClick={() => toggleExpand(order.orderNumber)}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm font-bold text-orange-400 font-mono uppercase">
                        {order.orderNumber}
                      </span>
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-[9px] text-emerald-400 font-mono font-bold px-2 py-0.5 rounded uppercase">
                        Authorized
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(order.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-6 md:border-l md:border-gray-900 md:pl-6">
                    <div className="text-left md:text-right font-mono">
                      <span className="text-[10px] text-gray-500 uppercase block">Total Sum</span>
                      <span className="text-base font-extrabold text-white">{formatMoney(order.total)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-500">
                      <span className="text-xs font-mono">{order.itemsCount} Node(s)</span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-orange-400" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Accordion Expandable Details */}
                {isExpanded && (
                  <div className="border-t border-gray-900/60 bg-black/20 p-6 space-y-6 animate-fadeIn">
                    
                    {/* Item list */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                        Hardware Nodes Transmitted
                      </h4>
                      <div className="space-y-3">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-900/40 last:border-b-0">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-900 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-sm text-white font-bold block truncate max-w-[200px] sm:max-w-xs">
                                  {item.name}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                  Qty {item.quantity} x {formatMoney(item.price)}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm font-mono font-bold text-white">
                              {formatMoney(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dispatch metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-900/40 text-xs font-mono text-gray-500">
                      <div className="space-y-1">
                        <span className="text-gray-600 block uppercase">Shipping Protocol Address</span>
                        <span className="text-white font-bold">{order.customerName}</span>
                        <p className="text-gray-400 mt-0.5">{order.email}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-gray-600 block uppercase">Network Dispatch Status</span>
                        <div className="flex items-center space-x-1.5 text-orange-400">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="font-bold">Awaiting Courier Sector Scan</span>
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
