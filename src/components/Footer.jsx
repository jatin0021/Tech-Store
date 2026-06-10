import { Home, Mail, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed! Thank you for joining the Tech Store network.");
    e.target.reset();
  };

  return (
    <footer className="bg-gray-950 border-t border-orange-950 text-gray-400 mt-20">
      {/* Policy highlights bar */}
      <div className="border-b border-orange-950/40 bg-gray-950/50">
        <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold font-mono">FREE DISPATCH</h4>
              <p className="text-xs text-gray-500">Free priority shipping on orders over $500</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold font-mono">30-DAY EXCHANGE</h4>
              <p className="text-xs text-gray-500">Hassle-free dynamic hardware swap policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold font-mono">SECURE MATRIX</h4>
              <p className="text-xs text-gray-500">Full warranty and encrypted SSL checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/">
            <div className="flex items-center space-x-3 text-white">
              <Home className="w-7 h-7 text-orange-400" />
              <span className="text-2xl font-extrabold uppercase tracking-wider font-sans">
                Tech <span className="text-orange-400">Store</span>
              </span>
            </div>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your premium node for state-of-the-art consumer technology, graphics processing units, folding cellular arrays, and audiophile sound nodes.
          </p>
        </div>

        {/* Categories Column */}
        <div>
          <h3 className="text-white font-bold font-mono text-sm uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-3">
            Hardware Sectors
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/?category=laptops" className="hover:text-orange-400 transition-colors duration-150">
                Laptops & Workstations
              </Link>
            </li>
            <li>
              <Link to="/?category=smartphones" className="hover:text-orange-400 transition-colors duration-150">
                Cellular Foldables & Phones
              </Link>
            </li>
            <li>
              <Link to="/?category=gaming" className="hover:text-orange-400 transition-colors duration-150">
                Gaming Graphics & Gear
              </Link>
            </li>
            <li>
              <Link to="/?category=audio" className="hover:text-orange-400 transition-colors duration-150">
                Audiophile Nodes & Earbuds
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h3 className="text-white font-bold font-mono text-sm uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-3">
            Support Deck
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-orange-400 transition-colors duration-150">
                Terminal Diagnostics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-400 transition-colors duration-150">
                Delivery Nodes & Rates
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-400 transition-colors duration-150">
                RMA Authorization
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-400 transition-colors duration-150">
                Matrix Network Status
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4">
          <h3 className="text-white font-bold font-mono text-sm uppercase tracking-wider border-l-2 border-orange-500 pl-3">
            Join the Network
          </h3>
          <p className="text-sm text-gray-500">
            Subscribe to receive system alerts, inventory restock logs, and clearance codes.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
              <input
                type="email"
                required
                placeholder="name@matrix.com"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-mono text-sm px-4 py-2.5 rounded-xl font-bold transition-all duration-150 cursor-pointer shadow-lg shadow-orange-500/20"
            >
              SYNC
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-orange-950/20 bg-black/40 py-6 text-center text-xs text-gray-600">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} TECH STORE. All transmission nodes online.</p>
          <div className="flex items-center space-x-3 text-gray-500">
            <span className="bg-gray-900 px-2 py-1 rounded border border-gray-800 text-[10px]">VISA</span>
            <span className="bg-gray-900 px-2 py-1 rounded border border-gray-800 text-[10px]">MC</span>
            <span className="bg-gray-900 px-2 py-1 rounded border border-gray-800 text-[10px]">AMEX</span>
            <span className="bg-gray-900 px-2 py-1 rounded border border-gray-800 text-[10px]">BTC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;