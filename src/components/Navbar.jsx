import { ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md text-white shadow-2xl shadow-gray-950/70 border-b border-orange-950">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to={"/"}>
            <div className="flex items-center space-x-3 cursor-pointer group">
              <img
                src="/favicon.svg"
                alt="Tech Store Logo"
                className="w-8 h-8 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] group-hover:scale-110 transition-transform duration-200"
              />
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider uppercase font-sans">
                Tech <span className="text-orange-400 group-hover:text-orange-300 transition-colors duration-200">Store</span>
              </h1>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to={"/orders"}
              className="relative p-3 bg-orange-500/10 rounded-xl hover:bg-orange-500/20 transition-all duration-200 border border-orange-400/30 hover:border-orange-400/60 shadow-lg cursor-pointer flex items-center justify-center animate-pulse-slow"
              title="Order Ledger"
            >
              <Package className="w-6 h-6 text-orange-400" />
            </Link>
            <Link
              to={"/cart"}
              className="relative p-3 bg-orange-500/10 rounded-xl hover:bg-orange-500/20 transition-all duration-200 border border-orange-400/30 hover:border-orange-400/60 shadow-lg cursor-pointer flex items-center justify-center"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6 text-orange-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 border border-gray-950">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
