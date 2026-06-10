import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const { id, name, price, image, stock, category } = product;

  const handleIncrement = () => {
    if (quantity < stock) {
      updateQuantity(id, quantity + 1);
    } else {
      alert(`Sorry, only ${stock} units of ${name} are currently in stock.`);
    }
  };

  const handleDecrement = () => {
    updateQuantity(id, quantity - 1);
  };

  // Format currency helper
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-950/30 border border-gray-900 rounded-3xl gap-4 hover:border-orange-500/20 transition-all duration-200">
      
      {/* Product Image & Meta */}
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-900 flex-shrink-0">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <Link to={`/product/${id}`} className="hover:text-orange-400 transition-colors">
            <h4 className="text-base font-bold text-white line-clamp-1">{name}</h4>
          </Link>
          <span className="text-xs text-orange-400/70 uppercase tracking-widest font-mono block mt-0.5">
            {category}
          </span>
          <span className="text-sm font-mono text-gray-500 block mt-1">
            {formatMoney(price)} each
          </span>
        </div>
      </div>

      {/* Adjusters & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-900/40 sm:border-t-0">
        
        {/* Quantity Increment/Decrement Wrapper */}
        <div className="flex items-center space-x-1 bg-gray-900/60 p-1 rounded-2xl border border-gray-800">
          <button
            onClick={handleDecrement}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-8 text-center text-sm font-bold font-mono text-white">
            {quantity}
          </span>
          
          <button
            onClick={handleIncrement}
            disabled={quantity >= stock}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              quantity >= stock
                ? "text-gray-700 cursor-not-allowed"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[80px]">
          <span className="text-base font-mono font-bold text-white block">
            {formatMoney(price * quantity)}
          </span>
        </div>

        {/* Trash delete button */}
        <button
          onClick={() => {
            removeFromCart(id);
            alert(`Removed ${name} from your cart.`);
          }}
          className="p-2.5 bg-red-950/10 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/50 text-red-400 rounded-xl transition-all duration-150 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
      
    </div>
  );
};

export default CartItem;
