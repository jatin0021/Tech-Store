import { Mail, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed! Thank you for joining the Tech Store network.");
    e.target.reset();
  };

  return (
    <footer className="bg-stone-950 text-stone-450 mt-20 border-t border-stone-900">
      
      {/* Policy highlights bar */}
      <div className="border-b border-stone-900 bg-stone-950/50">
        <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-450">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold font-sans text-sm tracking-wide">FREE DISPATCH</h4>
              <p className="text-xs text-stone-500">Free priority shipping on orders over $500</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-450">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold font-sans text-sm tracking-wide">30-DAY EXCHANGE</h4>
              <p className="text-xs text-stone-500">Hassle-free dynamic hardware swap policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-450">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold font-sans text-sm tracking-wide">SECURE CHECKOUT</h4>
              <p className="text-xs text-stone-500">Full warranty and encrypted SSL checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/">
            <div className="flex items-center space-x-3 text-white">
              <img
                src="/favicon.svg"
                alt="Tech Store Logo"
                className="w-7 h-7 drop-shadow-[0_2px_8px_rgba(249,115,22,0.15)]"
              />
              <span className="text-2xl font-black uppercase tracking-tight font-sans-title">
                Tech <span className="text-orange-500">Store</span>
              </span>
            </div>
          </Link>
          <p className="text-sm text-stone-500 leading-relaxed font-medium">
            Your premium node for state-of-the-art consumer technology, graphics processing units, folding cellular arrays, and audiophile sound nodes.
          </p>
        </div>

        {/* Categories Column */}
        <div>
          <h3 className="text-white font-bold font-sans-title text-sm uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-3">
            Hardware Sectors
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/?category=laptops#catalog" className="hover:text-orange-500 transition-colors duration-150 font-medium">
                Laptops &amp; Workstations
              </Link>
            </li>
            <li>
              <Link to="/?category=smartphones#catalog" className="hover:text-orange-500 transition-colors duration-150 font-medium">
                Cellular Foldables &amp; Phones
              </Link>
            </li>
            <li>
              <Link to="/?category=gaming#catalog" className="hover:text-orange-500 transition-colors duration-150 font-medium">
                Gaming Graphics &amp; Gear
              </Link>
            </li>
            <li>
              <Link to="/?category=audio#catalog" className="hover:text-orange-500 transition-colors duration-150 font-medium">
                Audiophile Nodes &amp; Earbuds
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h3 className="text-white font-bold font-sans-title text-sm uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-3">
            Support Deck
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/help" className="hover:text-orange-500 transition-colors duration-150 font-medium">
                Help &amp; Support Core
              </Link>
            </li>
            <li>
              <Link to="/help#diagnostics" className="hover:text-orange-500 transition-colors duration-150 font-medium">
                Terminal Diagnostics
              </Link>
            </li>
            <li>
              <Link to="/help#delivery" className="hover:text-orange-500 transition-colors duration-150 font-medium">
                Delivery Nodes &amp; Rates
              </Link>
            </li>
            <li>
              <Link to="/help#rma" className="hover:text-orange-500 transition-colors duration-150 font-medium">
                RMA Authorization
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-orange-500 transition-colors duration-150 font-medium">
                Security &amp; Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4">
          <h3 className="text-white font-bold font-sans-title text-sm uppercase tracking-wider border-l-2 border-orange-500 pl-3">
            Join the Network
          </h3>
          <p className="text-sm text-stone-500 font-medium">
            Subscribe to receive system alerts, inventory restock logs, and clearance codes.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-stone-600" />
              <input
                type="email"
                required
                placeholder="name@matrix.com"
                className="w-full bg-stone-900 border border-stone-850 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm px-4 py-2.5 rounded-xl font-bold transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
            >
              SYNC
            </button>
          </form>
        </div>
      </div>

      {/* Massive Brand Footer Text overlay block (mimics Frolax bottom brand stretch) */}
      <div className="border-t border-stone-900/60 pt-8 pb-10 text-center select-none overflow-hidden">
        <span className="text-[60px] sm:text-[120px] md:text-[180px] lg:text-[230px] font-black uppercase text-orange-600/5 font-serif-lux leading-none tracking-tighter block">
          TECH STORE©
        </span>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-stone-900/40 bg-black/40 py-6 text-center text-xs text-stone-500 font-mono">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} TECH STORE. All transmission nodes online.</p>
          <div className="flex items-center space-x-3 text-stone-500">
            <span className="bg-stone-900 px-2 py-1 rounded border border-stone-800 text-[10px]">VISA</span>
            <span className="bg-stone-900 px-2 py-1 rounded border border-stone-800 text-[10px]">MC</span>
            <span className="bg-stone-900 px-2 py-1 rounded border border-stone-800 text-[10px]">AMEX</span>
            <span className="bg-stone-900 px-2 py-1 rounded border border-stone-800 text-[10px]">BTC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;