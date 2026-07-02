import { ShoppingCart, User, Heart, LogOut, Menu, X, LayoutDashboard, Globe, Search, HelpCircle, Shield, ShoppingBag, Info } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mobile responsive menu toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  // Sync searchVal input with URL search params if any
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search") || "";
    setSearchVal(searchParam);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate("/collections");
    }
  };

  // Determine active route state helper
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white text-gray-900 border-b border-gray-200 shadow-sm py-3 px-4">
      <div className="container mx-auto flex justify-between items-center gap-4">
        
        {/* Left Side: Brand Logo */}
        <Link to={"/"} onClick={() => setMobileMenuOpen(false)} className="flex-shrink-0">
          <div className="flex items-center space-x-2.5 cursor-pointer group">
            <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
              <img
                src="/favicon.svg"
                alt="Tech Store Logo"
                className="w-6 h-6 group-hover:scale-105 transition-transform"
              />
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-gray-900">
              Tech<span className="text-blue-600">Store</span>
            </h1>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1">
          <Link
            to="/"
            className={`font-sans text-[15px] font-medium tracking-wide transition-all duration-150 px-3.5 py-2 rounded-lg ${
              isActive("/")
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            About
          </Link>
          
          <Link
            to="/collections"
            className={`font-sans text-[15px] font-medium tracking-wide transition-all duration-150 px-3.5 py-2 rounded-lg ${
              isActive("/collections")
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Collections
          </Link>
          
          <Link
            to="/help"
            className={`font-sans text-[15px] font-medium tracking-wide transition-all duration-150 px-3.5 py-2 rounded-lg ${
              isActive("/help")
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Diagnostics
          </Link>

          <Link
            to="/privacy"
            className={`font-sans text-[15px] font-medium tracking-wide transition-all duration-150 px-3.5 py-2 rounded-lg ${
              isActive("/privacy")
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Privacy
          </Link>
        </div>

        {/* Search Bar in Navbar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xs xl:max-w-sm w-full hidden md:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-150"
          />
        </form>

        {/* Right Side Tools: Wishlist, Cart, User Profile */}
        <div className="hidden lg:flex items-center space-x-2">
          
          {/* Wishlist Link */}
          {isAuthenticated && (
            <Link
              to="/wishlist"
              className={`p-2 rounded-lg transition-colors relative ${
                isActive("/wishlist") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>
          )}

          {/* Shopping Cart */}
          <Link
            to="/cart"
            className={`p-2 rounded-lg transition-colors relative ${
              isActive("/cart") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account/Session Manager */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-1.5 pl-2 border-l border-gray-200">
              <Link
                to="/profile"
                className={`flex items-center space-x-1.5 text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                  isActive("/profile") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="max-w-[70px] truncate">{user.name}</span>
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive("/admin") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                title="Disconnect session"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="pl-2 border-l border-gray-200">
              <Link
                to="/login"
                className="bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold px-4.5 py-2 rounded-lg cursor-pointer transition-colors block text-center"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Burger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-4 mt-2 space-y-3 shadow-lg rounded-xl animate-fadeIn text-sm">
          
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full pb-2">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </form>

          {isAuthenticated && (
            <div className="py-2.5 px-3 bg-gray-50 rounded-lg text-gray-500 flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-800">User: {user.name}</span>
            </div>
          )}

          <div className="flex flex-col space-y-1.5">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors flex items-center space-x-2 text-gray-700"
            >
              <Info className="w-4 h-4 text-gray-400" />
              <span>About</span>
            </Link>

            <Link
              to="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors flex items-center space-x-2 text-gray-700"
            >
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              <span>Collections</span>
            </Link>

            <Link
              to="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors flex items-center space-x-2 text-gray-700"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>Diagnostics</span>
            </Link>

            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors flex items-center space-x-2 text-gray-700"
            >
              <Shield className="w-4 h-4 text-gray-400" />
              <span>Privacy &amp; Security</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors flex items-center space-x-2 text-gray-700 font-medium"
              >
                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                <span>Admin Panel</span>
              </Link>
            )}

            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors flex items-center space-x-2 text-gray-700"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors flex items-center space-x-2 text-gray-700"
                >
                  <Heart className="w-4 h-4 text-gray-400" />
                  <span>My Wishlist</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors flex items-center space-x-2 text-gray-700"
                >
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                  <span>Order History</span>
                </Link>
              </>
            )}

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors flex justify-between items-center text-gray-700"
            >
              <span className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-gray-400" />
                <span>Shopping Cart</span>
              </span>
              {cartCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="pt-3 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-655 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
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
