import { ShoppingCart, User, Heart, LogOut, Menu, X, LayoutDashboard, Globe, Search, HelpCircle, Shield, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import toast from "react-hot-toast";

function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mobile responsive menu toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login");
    setMobileMenuOpen(false);
  };

  // Determine active route state helper
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md border-b border-orange-600/30 py-3.5 px-4">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Left Side: Brand Logo */}
        <Link to={"/"} onClick={() => setMobileMenuOpen(false)}>
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="p-1.5 bg-white/10 rounded-xl border border-white/20 shadow-sm">
              <img
                src="/favicon.svg"
                alt="Tech Store Logo"
                className="w-6.5 h-6.5 invert group-hover:scale-105 transition-transform"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight font-serif-lux text-white">
              Tech Store
            </h1>
          </div>
        </Link>

        {/* Center: White Pill Navigation (Frolax Style) */}
        <div className="hidden lg:flex items-center bg-white px-2 py-1.5 rounded-full shadow-sm border border-stone-200/50">
          <Link
            to="/"
            className={`font-sans text-xs uppercase font-bold tracking-wider transition-all duration-200 ${
              isActive("/")
                ? "bg-orange-600 text-white rounded-full px-5 py-2 shadow-sm"
                : "text-stone-700 hover:text-orange-600 px-4 py-2"
            }`}
          >
            Shop
          </Link>
          
          <Link
            to="/help"
            className={`font-sans text-xs uppercase font-bold tracking-wider transition-all duration-200 ${
              isActive("/help")
                ? "bg-orange-600 text-white rounded-full px-5 py-2 shadow-sm"
                : "text-stone-700 hover:text-orange-600 px-4 py-2"
            }`}
          >
            Diagnostics
          </Link>

          <Link
            to="/privacy"
            className={`font-sans text-xs uppercase font-bold tracking-wider transition-all duration-200 ${
              isActive("/privacy")
                ? "bg-orange-600 text-white rounded-full px-5 py-2 shadow-sm"
                : "text-stone-700 hover:text-orange-600 px-4 py-2"
            }`}
          >
            Privacy
          </Link>

          {isAuthenticated && (
            <Link
              to="/wishlist"
              className={`font-sans text-xs uppercase font-bold tracking-wider transition-all duration-200 ${
                isActive("/wishlist")
                  ? "bg-orange-600 text-white rounded-full px-5 py-2 shadow-sm"
                  : "text-stone-700 hover:text-orange-600 px-4 py-2"
              }`}
            >
              Wishlist
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/orders"
              className={`font-sans text-xs uppercase font-bold tracking-wider transition-all duration-200 ${
                isActive("/orders")
                  ? "bg-orange-600 text-white rounded-full px-5 py-2 shadow-sm"
                  : "text-stone-700 hover:text-orange-600 px-4 py-2"
              }`}
            >
              Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`font-sans text-xs uppercase font-bold tracking-wider transition-all duration-200 ${
                isActive("/admin")
                  ? "bg-orange-600 text-white rounded-full px-5 py-2 shadow-sm"
                  : "text-stone-700 hover:text-orange-600 px-4 py-2"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Side Tools: Search, Globe, Cart Pill */}
        <div className="hidden lg:flex items-center space-x-2.5">
          {/* Circular Search */}
          <button
            onClick={() => navigate("/")}
            className="p-2.5 bg-white text-stone-800 rounded-full hover:text-orange-600 shadow-sm border border-stone-200/40 transition-colors cursor-pointer"
            title="Search Products"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Globe Language Selector */}
          <div className="flex items-center space-x-1.5 bg-white text-stone-800 rounded-full px-4.5 py-2.5 shadow-sm border border-stone-200/40 text-[10px] font-mono font-bold uppercase select-none">
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span>Eng</span>
            <span className="text-[7px] text-stone-400">▼</span>
          </div>

          {/* Shopping Cart Pill */}
          <Link
            to="/cart"
            className="relative flex items-center bg-white text-stone-850 rounded-full px-4.5 py-2.5 shadow-sm border border-stone-200/40 hover:text-orange-600 transition-colors font-mono text-[10px] font-bold uppercase"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="bg-orange-600 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white ml-2">
              {cartCount}
            </span>
          </Link>

          {/* Account/Session Manager */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2 pl-1 border-l border-white/20">
              <Link
                to="/profile"
                className="flex items-center space-x-1.5 text-[10px] font-bold uppercase text-stone-800 py-2.5 px-4 bg-white rounded-full border border-stone-200/40 shadow-sm hover:text-orange-600"
              >
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span className="max-w-[70px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 text-red-600 bg-white hover:bg-red-50 border border-stone-200/40 rounded-full cursor-pointer shadow-sm"
                title="Disconnect session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-stone-850 hover:bg-stone-50 text-[10px] font-bold uppercase px-5 py-2.5 rounded-full shadow-sm border border-stone-200/40 cursor-pointer"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Burger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 bg-white text-stone-800 rounded-full shadow-sm cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white text-stone-850 rounded-2xl p-5 mt-4 space-y-4 text-xs font-semibold uppercase tracking-wider shadow-xl animate-fadeIn">
          {isAuthenticated && (
            <div className="pb-3 border-b border-stone-100 text-stone-500 flex items-center space-x-2">
              <User className="w-4 h-4 text-orange-600" />
              <span className="font-bold text-stone-800">User: {user.name}</span>
            </div>
          )}

          <div className="flex flex-col space-y-3 text-left pl-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600 py-1 transition-colors flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4 text-orange-600" />
              <span>Catalog</span>
            </Link>

            <Link
              to="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600 py-1 transition-colors flex items-center space-x-2"
            >
              <HelpCircle className="w-4 h-4 text-orange-600" />
              <span>Diagnostics</span>
            </Link>

            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600 py-1 transition-colors flex items-center space-x-2"
            >
              <Shield className="w-4 h-4 text-orange-600" />
              <span>Privacy Security</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-orange-600 font-bold py-1 transition-colors flex items-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-orange-600 py-1 transition-colors flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-orange-655" />
                  <span>Profile Ledger</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-orange-600 py-1 transition-colors flex items-center space-x-2"
                >
                  <Heart className="w-4 h-4 text-orange-655" />
                  <span>Wishlist Buffer</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-orange-600 py-1 transition-colors flex items-center space-x-2"
                >
                  <Package className="w-4 h-4 text-orange-655" />
                  <span>Transaction Ledger</span>
                </Link>
              </>
            )}

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600 py-1 transition-colors flex justify-between items-center"
            >
              <span className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-orange-600" />
                <span>Shopping Cart</span>
              </span>
              <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </Link>
          </div>

          <div className="pt-3 border-t border-stone-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Session</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Login Profile</span>
              </Link>
            )}
          </div>
        </div>
      )}

    </header>
  );
}

export default Navbar;
